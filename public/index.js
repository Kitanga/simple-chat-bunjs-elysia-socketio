const socket = io();

// Get the user ID

let UID = localStorage.getItem('uid');

if (!UID) {
    const newUID = UID = ulid();

    localStorage.setItem('uid', newUID);
}

// NOTE: Constants
const EVENTS = {
    SEND: "SEND",
    NEW_MESSAGE: "NEW_MESSAGE",
};

/** @type {HTMLTextAreaElement} */
const messageTextEle = document.getElementById('message-text');
/** @type {HTMLDivElement} */
const sendBtnEle = document.getElementById('send');
/** @type {HTMLElement} */
const mainEle = document.getElementById('main');
/** @type {HTMLDivElement} */
const messagesEle = document.getElementById('messages');

sendBtnEle.onclick = () => {
    const text = messageTextEle.value.trim();

    if (text) {
        // TODO: send to server

        const messageEle = createMessageEle(text, 'Me');

        messagesEle.appendChild(messageEle);

        messageTextEle.value = '';

        setTimeout(() => {
            messageEle.scrollIntoView();
        }, 500);

        socket.emit(EVENTS.SEND, {
            id: UID,
            message: {
                text,

            }
        })
    }
};

messageTextEle.onkeyup = ev => {
    if (ev.key == 'Enter') {
        sendBtnEle.click();
    }
}

window.onload = () => {
    mainEle.getBoundingClientRect()
    // console.log('main:', mainEle.scrollTop, mainEle.scrollHeight);
    mainEle.scrollTop = mainEle.scrollHeight;
    // console.log('main:', mainEle.scrollTop, mainEle.scrollHeight);



    socket.on('connect', function () {
        console.log('id:', socket.id);

        socket.on(EVENTS.NEW_MESSAGE, ({ id, message }) => {
            console.log('data:', id, message)
            
            const messageEle = createMessageEle(message.text, id.slice(0, 5), true);

            messageEle.setAttribute('id', message.id);
            
            messagesEle.appendChild(messageEle);
        });
    });
};

function createMessageEle(text, sender, isOther = false) {
    const messageHTML =
        `<span>${sender}</span>
        <div class="message-inner">
            ${text}
        </div>`;

    const ele = document.createElement('div');

    ele.innerHTML = messageHTML;

    ele.classList.add('message');

    if (isOther) {
        ele.classList.add('other');
    }

    return ele;
}