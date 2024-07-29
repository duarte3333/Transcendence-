import { routeMessage } from './core/router.js'


export function MyWebSocket() {

    const urlParams = new URLSearchParams(window.location.search);
    let scopeType = urlParams.get('scopeType') || "chat";
    let scopeId = urlParams.get('scopeId') || "room1";

    let chatSocket = new WebSocket(
        'wss://' + window.location.host + '/ws/' + scopeType + '/' + scopeId + '/'
    );

    chatSocket.onopen = function(e) {
        console.log("The socket is already open.");
    }

    chatSocket.onmessage = function(e) {
        let data = JSON.parse(e.data);
        routeMessage(data);
    }

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    }

    function sendMessage() {
        let messageInputDom = document.getElementById('messageInput');
        let message = messageInputDom.value;

        chatSocket.send(JSON.stringify({
            'type': 'chat_message',
            'message': message
        }));
        messageInputDom.value = '';
    }

    return { sendMessage }
}