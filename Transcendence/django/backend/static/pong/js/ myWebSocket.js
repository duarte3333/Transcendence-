export let socket;

export function initializeWebSocket() {
    if (!socket) {
        socket = new WebSocket('wss://xxxxxx/ws/');

        socket.onopen = function() {
            console.log("WebSocket connection established");
        }

        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log("Message received: ", data);
            handleWebSocketData(data);
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
    const event = new CustomEvent('websocketData', { detail: data });
    document.dispatchEvent(event);
}