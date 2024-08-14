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
        if (socket)
            console.log("socket object" + socket.readyState + " socket url " + socket.url);

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
    console.log("Message received from server:", data);

    if (data.type === 'chat_message') {
        const message = `${data.sender}: ${data.message}<br>`;
        window.chat.storeMessages(data.sender, data.receiver, message);
        window.chat.appendChatMessage(message, data.sender);
    } 
    else if (data.type === 'paddle_update') {
        console.log("handleWebSocketMessage paddle_update: " + data.paddle_x + ", " + data.paddle_y);
    }  
    else if (data.type === 'ball_update') {
      console.log("handleWebSocketMessage ball_update: " + data.ball_x + ", " + data.ball_y);
    } 
    else {
        console.error("Unexpected message type received:", data.type);
    }
}

// function handleWebSocketData(data) {
//     const event = new CustomEvent('websocketData', { detail: data });
//     document.dispatchEvent(event);
// }


//   handleWebSocketMessage(event) {
//     // const data = JSON.parse(event.data);
//     // const User = JSON.parse(ActiveUser)[0].username;
//     if (data.type === 'chat_message') {
//       const message = `${User}: ${data.message}`;
//       this.storeMessages(User, data.sender, message);
//       this.appendChatMessage(message, User);
//       console.log("handleWebSocketMessage " + data.sender.replace('Player', 'player_'));
//     } 
//     else if (data.type === 'connection_established') {
//       console.log("handleWebSocketMessage channel_name: " + channel_name);
//     } 
//     else if (data.type === 'paddle_update') {
//       console.log("handleWebSocketMessage paddle_update: " + data.paddle_x + ", " + data.paddle_y);
//     } 
//     else if (data.type === 'ball_update') {
//       console.log("handleWebSocketMessage ball_update: " + data.ball_x + ", " + data.ball_y);
//     } 
//     else if (data.type === 'ball_update') {
//       console.log("handleWebSocketMessage ball_update: " + data.ball_x + ", " + data.ball_y);
//     }
//     else {
//       console.error("Received unexpected message type:", data.type);
//     }
//   }