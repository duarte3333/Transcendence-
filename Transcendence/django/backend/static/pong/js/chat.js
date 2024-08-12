import { initializeWebSocket, socket, name } from "./myWebSocket.js";

// export const users = JSON.stringify([
//   { username: "Liberal", status: "online" },
//   { username: "Xaleira", status: "online" },
//   { username: "Rubens", status: "online" },
//   { username: "Duarte", status: "online" },
//   { username: "Teo", status: "online" }
// ]);

export const users = JSON.stringify([
  { username: "Liberal", status: "online" },
  { username: "Teo", status: "online" }
]);

export const ActiveUser = JSON.stringify([
  { username: "Liberal", status: "online" },
]);

export const ActiveUser2 = JSON.stringify([
  { username: "Teo", status: "online" },
]);

export const test = JSON.stringify([
  { username: "test_user", status: "online" },
]);


class Chat {
  constructor() {
    this.chatButton = document.getElementById('chatButton');
    this.chatWindow = document.getElementById('chatWindow');
    this.chatInput = document.getElementById('chatInput');
    this.sendChatButton = document.getElementById('sendChatButton');
    this.chatSideBar = document.getElementById('chatSideBar');

    this.SelectedPlayer = null;
    this.chatBody = null;
    this.open = false;
    this.messages = {};
    this.General = {};

    this.messagesHistory = new Map();

    this.setupEventListeners();
    this.closeChat();
  }

  setupEventListeners() {
    if (this.chatButton)
      this.chatButton.addEventListener('click', () => this.toggleChatWindow());
    if (this.sendChatButton)
      this.sendChatButton.addEventListener('click', () => this.sendChatMessage());
    this.setup();
  }

  async setup() {
    while (socket.readyState !== WebSocket.OPEN) {
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    this.generatePlayerButtons(users);
  }

  sendBasicInfo(length) {
    if (socket && socket.readyState === WebSocket.OPEN) {

      console.log("Mensagem que será enviada ao Backend: " + users);
      socket.send(JSON.stringify({
        type: 'room_info',
        'numplayers': length,
        'players': users
      }));
    }
  }

  createGeneralButton() {
    const GeneralButton = document.createElement("button");
    GeneralButton.innerText = "General";
    GeneralButton.onclick = () => {
      this.SelectedPlayer = 'General';
      this.selectChannel('General');
    }
    this.chatSideBar.appendChild(GeneralButton);
    const ChatBodyChild = document.createElement("div");
    ChatBodyChild.id = `chatBody_General`;
    ChatBodyChild.style.display = 'none';
    chatBody.appendChild(ChatBodyChild);
  }

  generatePlayerButtons() {
    this.chatSideBar.innerHTML = ''; // Limpa a barra lateral

    let JsonArray = JSON.parse(ActiveUser);
    let length = JsonArray.length;
    let User;
    if (name === 'Liberal') {
      User = JSON.parse(ActiveUser2)[0].username;
    } else if (name === 'Teo') {
      User = JSON.parse(ActiveUser)[0].username;
    } else {
      User = JSON.parse(test)[0].username;
    }

    // Acrescenta o botão General
    this.createGeneralButton();

    //Coloca o botão dos chat para os users
    for (let i = 0; i < length; i++) {
      const button = document.createElement("button");
        
      button.innerText = User;
      button.onclick = () => {
        this.SelectedPlayer = User;
        this.selectChannel(User);
      };
      this.chatSideBar.appendChild(button);

      const ChatBodyChild = document.createElement("div");
      ChatBodyChild.id = `chatBody_${User}`;
      ChatBodyChild.style.display = 'none';
      chatBody.appendChild(ChatBodyChild);
    }
    this.sendBasicInfo(length);
  }

  selectChannel(channel) {
    let showtext = "";
    if (!this.messages[`chatBody_${channel}`])
      this.messages[`chatBody_${channel}`] = [];

    for (let element of this.messages[`chatBody_${channel}`])
      showtext += element.message;
    
    console.log("--SeletectChannel---------");
    console.log(showtext);
    console.log("-----------");
    document.getElementById("chatBodyChildren").innerHTML = showtext;
    
    document.getElementById("chatHeader").innerText = `Chat - ${channel.charAt(0).toUpperCase() + channel.slice(1)}`;
    // this.loadMessages(channel);
    console.log("SelectChannel() " + this.SelectedPlayer);
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
    console.log
    if (message && socket && this.SelectedPlayer != null) {
      
      let User;

      if (this.SelectedPlayer === 'Liberal') {
        User = JSON.parse(ActiveUser2)[0].username;
      } else {
        User = JSON.parse(ActiveUser)[0].username;
      }

      socket.send(JSON.stringify({
        'type': 'chat_message',
        'message': message,
        'sender': User,
        'receiver': this.SelectedPlayer,
      }));
      this.chatInput.value = '';
      const fullMessage = `${User}: ${message + "<br>"}`;
      
      this.storeMessages(User, this.SelectedPlayer, fullMessage);

      const playerId = this.SelectedPlayer.replace('Player', 'player_');
      this.appendChatMessage(fullMessage, playerId);
    } else {
      console.error("sendChatMessage() Message not sent: invalid conditions.");
    }
  }

  storeMessages(sender, receiver, message) {
    // const p = player.replace('Player', 'player_');
    const chatKey = `chatBody_${receiver}`;

    if (!this.messages[chatKey])
      this.messages[chatKey] = [];

    this.messages[chatKey].push({sender, receiver, message});
    
    console.log("storeMessages()Test content: " + JSON.stringify(this.messages));

    this.messages[chatKey].forEach((msg, index) => {
      console.log(
        `storeMessages() Message ${index + 1} stored: Sender: ${msg.sender}, Receiver: ${msg.receiver}, Message: ${msg.message}`
      );
    });
  }

  appendChatMessage(message, player) {
    const chatBodyChildren = document.getElementById("chatBodyChildren");

    const line = message + '\n';
    if (chatBodyChildren) {
      chatBodyChildren.innerHTML += line;
    } else {
      console.error(`chatBodyChildren not found for player: ${player}`);
    }
  }
  
}

document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username') || 'test_user';
  
  initializeWebSocket(username);
  window.chat = new Chat();
})


/*loadMessages(player) {
    const id = `chatBody_${player}`;
    const messages = this.messages[id] || [];

    console.log("HERE I AM: " + JSON.stringify(messages));

    const filteredMessages = messages.filter(msg => msg.receiver === player);

    if (!this.lastLoadedMessageCount) {
      this.lastLoadedMessageCount = {};
    }
  
    if (this.lastLoadedMessageCount[id] !== filteredMessages.length) {
      // Apenas esconde os outros contêineres, não limpa as mensagens
      const allPlayerContainers = document.querySelectorAll('[id^="chatMessages_"]');
      allPlayerContainers.forEach(container => {
        container.style.display = 'none';
      });

      // Mostra o contêiner de mensagens para o jogador selecionado
      const playerContainer = document.getElementById(`chatMessages_${player}`);
      if (playerContainer) {
        playerContainer.style.display = 'flex';
      } else {
        // Se o contêiner não existir, cria e adiciona as mensagens
        filteredMessages.forEach(({ message }) => {
            this.appendChatMessage(message, player);
        });
      }

      // Atualiza o último comprimento carregado
      this.lastLoadedMessageCount[id] = filteredMessages.length;
    }
  }
  */
/*handleWebSocketMessage(event) {
    // const data = JSON.parse(event.data);
    // const User = JSON.parse(ActiveUser)[0].username;
    if (data.type === 'chat_message') {
      const message = `${User}: ${data.message}`;
      this.storeMessages(User, data.sender, message);
      this.appendChatMessage(message, User);
      console.log("handleWebSocketMessage " + data.sender.replace('Player', 'player_'));
    } 
    // else if (data.type === 'connection_established') {
    //   console.log("handleWebSocketMessage channel_name: " + channel_name);
    // } 
    // else if (data.type === 'paddle_update') {
    //   console.log("handleWebSocketMessage paddle_update: " + data.paddle_x + ", " + data.paddle_y);
    // } 
    // else if (data.type === 'ball_update') {
    //   console.log("handleWebSocketMessage ball_update: " + data.ball_x + ", " + data.ball_y);
    // } 
    // else if (data.type === 'ball_update') {
    //   console.log("handleWebSocketMessage ball_update: " + data.ball_x + ", " + data.ball_y);
    // }
    else {
      console.error("Received unexpected message type:", data.type);
    }
  }

  */
