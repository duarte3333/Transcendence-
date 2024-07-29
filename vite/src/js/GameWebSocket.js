// // GameWebsocket class

// export class GameWebSocket {
//     constructor(roomName) {
//         this.messageQueue = [];
//         this.isConnected = false;
//         this.roomName = roomName;
//         this.socket = `ws://${window.location.hostname}:8000/ws/game/${roomName}/`;
//         this.gameSocket = new WebSocket(this.socket);

//         this.gameSocket.onopen = this.onopen.bind(this);
//         this.gameSocket.onerror = this.onerror.bind(this);
//         this.gameSocket.onmessage = this.onmessage.bind(this);
//         this.gameSocket.onclose = this.onclose.bind(this);
//     }

//     onopen() {
//         this.isConnected = true;

//         while (this.messageQueue.length > 0)
//             this.gameSocket.send(messageQueue.shift());
        
//         console.log('WebSocket está top');
//     }

//     onerror(error) {
//         console.error('WebSocket error:', error);
//     }
      
//     onmessage(e) {
//         const data = JSON.parse(e.data);
//         if (this.onGameUpdate)
//             this.onGameUpdate(data);
//     }
      
//     onclose = function(e) {
//         console.error('Game socket closed unexpectedly');
//     }

//     sendMessage(message) {
//         console.log(JSON.stringify(message));
//         if (this.isConnected) {
//             this.gameSocket.send(JSON.stringify(message));
//         } else {
//             this.messageQueue.push(JSON.stringify(message));
//         }
//     }

//     setOnGameUpdateCallback(callback) {
//         this.onGameUpdate = callback;
//     }

// }

