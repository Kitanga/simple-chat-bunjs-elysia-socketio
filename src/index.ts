import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";
import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static';
import { file } from "bun";
import { EVENTS } from "./common/constants";

const io = new Server();
const engine = new Engine();

io.bind(engine);

io.on("connection", (socket) => {
  console.log('socket:', socket.id);

  const ID = socket.id;

  socket.on(EVENTS.SEND, ({ id, message }) => {
    socket.broadcast.emit(EVENTS.NEW_MESSAGE, {
      id,
      message
    })
  });
});

const app = new Elysia()
  // Static files hosting
  .use(staticPlugin({
    prefix: '/'
  }))

  // Hosting the files
  .get('/', async () => {
    return await file('public/index.html');
  })

  // Socket.io
  .all("/socket.io/", ({ request, server }) => engine.handleRequest(request, server as any))

  .onStart(() => {
    console.log('Hello I started on Port 3000 at: ' + new Date())
  })

  .listen({
    port: 3000,
    ...engine.handler(),
  });