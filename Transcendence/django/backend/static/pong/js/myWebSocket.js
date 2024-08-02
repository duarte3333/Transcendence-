export let socket;

export function initializeWebSocket(scopeType, scopeId) {
    if (!socket) {
        const protocol = 'wss://';
        const host = window.location.host;
        const wsUrl = `${protocol}${host}/ws/`;

        console.log("WebSocket URL:", wsUrl);
        socket = new WebSocket(wsUrl);

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