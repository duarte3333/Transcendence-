export let socket;
export let channel_name;

export function initializeWebSocket() {
    if (!socket) {
        const protocol = 'wss://';
        const host = window.location.host;
        // const port = "8000"

        // const wsUrl = `${protocol}${host}:${port}/ws/`;
        const wsUrl = `${protocol}${host}/ws/`;
        socket = new WebSocket(wsUrl);
        if (socket)
            console.log("socket object" + socket.readyState + " socket url " + socket.url);

        socket.onopen = function() {
            console.log("WebSocket connection established. Status: " + socket.readyState);
        }

        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            //console.log("onmessage está a ser chamado aqui.");
            //console.log(data);
            if (data.type === 'connection_established' ) {
                channel_name = data.name;
                //console.log("My channel name: ", data.name);
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
    const event = new CustomEvent('websocketData', { detail: data });
    document.dispatchEvent(event);
}