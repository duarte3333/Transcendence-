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
    // this.playerForm = document.getElementById('playerForm');
    this.SelectedPlayer = null;
    this.chatBody = null;
    this.open = false;
    this.messages = {};
    this.general = {};

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
    const generalButton = document.createElement("button");
    generalButton.innerText = "General";
    generalButton.onclick = () => this.selectChannel('general');
    this.chatSideBar.appendChild(generalButton);
    const ChatBodyChild = document.createElement("div");
    ChatBodyChild.id = `chatBody_general`;
    ChatBodyChild.style.display = 'none';
    chatBody.appendChild(ChatBodyChild);

    //Coloca o botão dos chat para os users
    for (let i = 0; i < length; i++) {

      // const player = JsonArray[i];
      // if (player.username !== active[0].username) {
      //   const button = document.createElement("button");
        
      //   //colocarei aqui o nome do Validate User
      //   button.innerText = player.username;
      //   button.onclick = () => {
      //     this.SelectedPlayer = player.username;
      //     this.selectChannel(player.username);
      //   };
      //   this.chatSideBar.appendChild(button);
  
      //   // Cria um novo espaço de mensagens para cada jogador
      //   const ChatBodyChild = document.createElement("div");
      //   ChatBodyChild.id = `chatBody_${player.username}`;
      //   ChatBodyChild.style.display = 'none';
      //   chatBody.appendChild(ChatBodyChild);
      // }

      const button = document.createElement("button");
        
      //colocarei aqui o nome do Validate User
      button.innerText = User;
      button.onclick = () => {
        this.SelectedPlayer = User;
        this.selectChannel(User);
      };
      this.chatSideBar.appendChild(button);

      // Cria um novo espaço de mensagens para cada jogador
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

    console.log("-----------");
    console.log(showtext);
    console.log("-----------");
    document.getElementById("chatBodyChildren").innerHTML = showtext;

    document.getElementById("chatHeader").innerText = `Chat - ${channel.charAt(0).toUpperCase() + channel.slice(1)}`;
    // this.loadMessages(channel);
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
      console.error("Message not sent: invalid conditions.");
    }
  }

  storeMessages(receiver, message) {
    // const p = player.replace('Player', 'player_');
    const chatKey = `chatBody_${receiver}`;

    if (!this.messages[chatKey])
      this.messages[chatKey] = [];

    this.messages[chatKey].push({receiver, message});
    let content = JSON.stringify(this.messages);
    console.log("Test content: " + content);

    console.log(
      "Messagens guardadas: " 
      + content.sender 
      + ", ", content.receiver 
      + ", ", content.message
  );
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
  // loadMessages(player) {
  //   const id = `chatBody_${player}`;
  //   const messages = this.messages[id] || [];

  //   console.log("HERE I AM: " + JSON.stringify(messages));

  //   const filteredMessages = messages.filter(msg => msg.receiver === player);

  //   if (!this.lastLoadedMessageCount) {
  //     this.lastLoadedMessageCount = {};
  //   }
  
  //   if (this.lastLoadedMessageCount[id] !== filteredMessages.length) {
  //     // Apenas esconde os outros contêineres, não limpa as mensagens
  //     const allPlayerContainers = document.querySelectorAll('[id^="chatMessages_"]');
  //     allPlayerContainers.forEach(container => {
  //       container.style.display = 'none';
  //     });

  //     // Mostra o contêiner de mensagens para o jogador selecionado
  //     const playerContainer = document.getElementById(`chatMessages_${player}`);
  //     if (playerContainer) {
  //       playerContainer.style.display = 'flex';
  //     } else {
  //       // Se o contêiner não existir, cria e adiciona as mensagens
  //       filteredMessages.forEach(({ message }) => {
  //           this.appendChatMessage(message, player);
  //       });
  //     }

  //     // Atualiza o último comprimento carregado
  //     this.lastLoadedMessageCount[id] = filteredMessages.length;
  //   }
  // }

  // handleWebSocketMessage(event) {
  //   // const data = JSON.parse(event.data);
  //   // const User = JSON.parse(ActiveUser)[0].username;
  //   if (data.type === 'chat_message') {
  //     const message = `${User}: ${data.message}`;
  //     this.storeMessages(User, data.sender, message);
  //     this.appendChatMessage(message, User);
  //     console.log("handleWebSocketMessage " + data.sender.replace('Player', 'player_'));
  //   } 
  //   // else if (data.type === 'connection_established') {
  //   //   console.log("handleWebSocketMessage channel_name: " + channel_name);
  //   // } 
  //   // else if (data.type === 'paddle_update') {
  //   //   console.log("handleWebSocketMessage paddle_update: " + data.paddle_x + ", " + data.paddle_y);
  //   // } 
  //   // else if (data.type === 'ball_update') {
  //   //   console.log("handleWebSocketMessage ball_update: " + data.ball_x + ", " + data.ball_y);
  //   // } 
  //   // else if (data.type === 'ball_update') {
  //   //   console.log("handleWebSocketMessage ball_update: " + data.ball_x + ", " + data.ball_y);
  //   // }
  //   else {
  //     console.error("Received unexpected message type:", data.type);
  //   }
  // }
}


document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username') || 'test_user';
  
  initializeWebSocket(username);
  window.chat = new Chat();
})
