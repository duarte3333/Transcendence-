// function openChat() {
//     document.getElementById("chatWindow").style.display = "flex";
//   }

// function closeChat() {
//   document.getElementById("chatWindow").style.display = "none";
// }

// function selectChannel(channel) {
//   document.getElementById("chatHeader").innerText = `Chat - ${channel.charAt(0).toUpperCase() + channel.slice(1)}`;
//   document.getElementById("chatBody").innerHTML = `<!-- Conteúdo do chat para ${channel} vai aqui -->`;
// }

// function sendMessage() {
// const message = document.getElementById("chatInput").value;
// // Lógica para enviar a mensagem
// document.getElementById("chatInput").value = '';
// }

// // Certifique-se de que a janela do chat está oculta ao carregar a página
// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("chatWindow").style.display = "none";
// });

// // Função para gerar botões de jogadores dinamicamente
// document.getElementById("playerForm").addEventListener("submit", function(event) {
//     event.preventDefault();
//     const numPlayers = document.getElementById("numPlayers").value;
//     const chatSidebar = document.getElementById("chatSidebar");
//     chatSidebar.innerHTML = '<button onclick="selectChannel(\'general\')">General</button>';
//     for (let i = 1; i <= numPlayers; i++) {
//       const button = document.createElement("button");
//       button.innerText = `Player ${i}`;
//       button.onclick = function() { selectChannel(`player${i}`); };
//       chatSidebar.appendChild(button);
//     }
// });

// let open = false;
// document.getElementById("chatButton").addEventListener("click", function() {
//     if (!open) {
//       openChat(); open = true;
//     } else {
//       closeChat(); open = false;
//     }
// });  

// document.getElementById("closeChat").addEventListener("click", closeChat);
// document.getElementById("sendButton").addEventListener("click", sendMessage);
// document.getElementById("chatSidebar").addEventListener("click", selectChannel);

import { initializeWebSocket, socket } from "./myWebSocket.js";

class Chat {
  constructor() {
    this.chatButton = document.getElementById('chatButton');
    this.chatWindow = document.getElementById('chatWindow');
    this.chatInput = document.getElementById('chatInput');
    this.sendChatButton = document.getElementById('sendChatButton');
    this.chatBody = document.getElementById('chatBody');
    this.chatSideBar = document.getElementById('chatSideBar');

    this.playerForm = document.getElementById('playerForm');

    this.open = false;

    this.setupEventListeners();
    this.closeChat();
    this.numberPlayers = 0;
  }

  setupEventListeners() {
    if (this.chatButton)
      this.chatButton.addEventListener('click', () => this.toggleChatWindow());
    if (this.sendChatButton)
      this.sendChatButton.addEventListener('click', () => this.sendChatMessage());
    if (this.playerForm)
      this.playerForm.addEventListener('submit', (event) => this.handlePlayerFormSubmit(event));
    document.addEventListener('websocketData', (event) => this.handleWebSocketMessage(event));
  }
 
  toggleChatWindow() {
    if (!socket)
      initializeWebSocket();
    this.open ? this.closeChat() : this.openChat();
    this.open = !this.open;
  }

  closeChat() {
    this.chatWindow.style.display = "none";
  }

  openChat() {
    this.chatWindow.style.display = "flex";
  }

  sendChatMessage() {
    const message = this.chatInput.value;
    if (message && socket) {
      socket.send(JSON.stringify({
        'type': 'chat',
        'message': message
      }));
      this.chatInput.value = '';
    }
  }

  handlePlayerFormSubmit(event) {
    event.preventDefault();
    const numPlayers = document.getElementById("numPlayers").value;
    const playerData = {
      numPlayers: numPlayers
      // Adicione outras informações que deseja coletar
    };
    document.getElementById("playerData").value = JSON.stringify(playerData);
    this.generatePlayerButtons(numPlayers);
  }

  generatePlayerButtons(nPlayers) {
    this.chatSideBar.innerHTML = ''; // Limpa a barra lateral
    const generalButton = document.createElement("button");
    generalButton.innerText = "General";
    generalButton.onclick = () => this.selectChannel('general');
    if (this.chatSideBar)
      this.chatSideBar.appendChild(generalButton);

    for (let i = 1; i <= nPlayers; i++) {
      const button = document.createElement("button");
      button.innerText = `Player ${i}`;
      button.onclick = () => this.selectChannel(`player${i}`);
      this.chatSideBar.appendChild(button);
    }
  }

  selectChannel(channel) {
    document.getElementById("chatHeader").innerText = `Chat - ${channel.charAt(0).toUpperCase() + channel.slice(1)}`;
    document.getElementById("chatBody").innerHTML = `<!-- Conteúdo do chat para ${channel} vai aqui -->`;
  }

  handleWebSocketMessage(event) {
    const data = event.detail;
    if (data.type === 'chat')
      this.appendChatMessage(data.message);
  }

  appendChatMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    this.chatBody.appendChild(messageElement);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  new Chat();
});
