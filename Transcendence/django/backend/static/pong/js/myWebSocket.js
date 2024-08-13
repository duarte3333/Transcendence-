export let socket;
export let name;
export let channel_name;

export function initializeWebSocket(username) {
    if (!socket) {
        name = username;
        const protocol = 'wss://';
        const host = window.location.host;

        const wsUrl = `${protocol}${host}/ws/${username}/`;

        socket = new WebSocket(wsUrl);
        if (socket) {
            console.log("socket object" + socket.readyState + " socket url " + socket.url);
            window.chatSocket = socket;
        }

        socket.onopen = function() {
            console.log("WebSocket connection established. Status: " + socket.readyState);
        }

        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if (data.type === 'connection_established' ) {
                channel_name = data.name;
                // console.log("My channel name: ", data.name);
            } else {
                //console.log("Message received: ", data);
                handleWebSocketData(data);
            }
            //console.log("Channel name aberto: " + channel_name);
        }

        socket.onclose = function(e) {
            console.log("WebSocket connection closed");
        }

        socket.onerror = function(e) {
            console.log("WebSocket error: ", e);
        }

        window.addEventListener('beforeunload', function() {
            if (socket) {
                socket.close();
            }
        })
    }
}


function handleWebSocketData(data) {
    console.log("handleWebSocketData() Message received from server:", data);

    if (data.type === 'chat_message') {
        const message = `${data.sender}: ${data.message}<br>`;
        const hash = data.hash;
        const sender = data.sender;
        const receiver = data.receiver;

        const storedHash = localStorage.getItem(`${sender}_${receiver}_chatHash`);

        if (hash === storedHash) {
            console.log("handleWebSocketData() messages: " + message);
            window.chat.storeMessages(sender, receiver, hash, message);
            window.chat.addToMessagesHistory(storedHash, message);
            window.chat.appendChatMessage(message, sender);
        }
        else {
            console.error("Hash mismatch: Mensagem recebida para um hash desconhecido:", hash);
        }
    } else {
        console.error("Unexpected message type received:", data.type);
    }
}

// function handleWebSocketData(data) {
//     const event = new CustomEvent('websocketData', { detail: data });
//     document.dispatchEvent(event);
// }