import { socket, channel_name } from "./myWebSocket.js";

export const users = [
  { username: "Liberal", status: "online" },
  { username: "Xaleira", status: "online" },
  { username: "Rubens", status: "online" },
  { username: "Duarte", status: "online" },
  { username: "Teo", status: "online" }
];

class Chat {
  constructor(number_players) {
    this.chatButton = document.getElementById('chatButton');
    this.chatWindow = document.getElementById('chatWindow');
    this.chatInput = document.getElementById('chatInput');
    this.sendChatButton = document.getElementById('sendChatButton');
    this.chatSideBar = document.getElementById('chatSideBar');
    // this.playerForm = document.getElementById('playerForm');
    this.activePlayer = null;
    this.chatBody = null;
    this.open = false;
    this.numberPlayers = number_players;
    this.messages = {};

    // this.setupEventListeners();

    this.closeChat();
  }

  setupEventListeners() {
    if (this.chatButton)
      this.chatButton.addEventListener('click', () => this.toggleChatWindow());
    if (this.sendChatButton)
      this.sendChatButton.addEventListener('click', () => this.sendChatMessage());
    // this.handlePlayerFormSubmit();
    this.generatePlayerButtons(users);
    // socket.addEventListener('message', (event) => this.handleWebSocketMessage(event));
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
        'type': 'chat_message',
        'message': message,
        'sender': this.activePlayer
      }));
      this.chatInput.value = '';
      const fullMessage = `${this.activePlayer}: ${message}`;
      this.storeMessages(this.activePlayer, fullMessage);
      const playerId = this.activePlayer.replace('Player', 'player_');
      this.appendChatMessage(fullMessage, playerId);
    }
  }

  appendChatMessage(message, player) {
    const chatBody = document.getElementById(`chatBody`);

    if (chatBody) {
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      chatBody.appendChild(messageElement);
    } else {
      console.error(`chatBody_${player} not found`);
    }
  }

  handlePlayerFormSubmit(event) {
    // event.preventDefault();
    console.log("handlePlayerFormSubmit")
    // const numPlayers = document.getElementById("numPlayers").value;
    // const playerData = {
    //   numPlayers: numPlayers
    // };
    //Aqui será enviada a requisição para o Backend sobre os users
    document.getElementById("playerData").value = JSON.stringify(users);
    this.numberPlayers = numPlayers;
    this.generatePlayerButtons(numPlayers);
  }

  sendBasicInfo(nPlayers) {
    console.log("sendBasicInfo");
    if (socket && socket.readyState === WebSocket.OPEN) {
      const players = [];
      for (let i = 1; i <= nPlayers; i++) {
        players.push({ id: `player_${i}`, name: nPlayers.name });

      }
      console.log("Mensagem que será enviada ao Backend: " + players);
      socket.send(JSON.stringify({
        type: 'room_info',
        'numplayers': nPlayers,
        'players': players
      }));
    }
    console.log("Terminei o SendBasicInfo");
  }

  generatePlayerButtons(player) {
    console.log("generatePlayerButtons");
    this.chatSideBar.innerHTML = ''; // Limpa a barra lateral

    // Acrescenta o botão General
    const generalButton = document.createElement("button");
    generalButton.innerText = "General";
    generalButton.onclick = () => this.selectChannel('general');
    this.chatSideBar.appendChild(generalButton);

    for (let i = 1; i <= player.length; i++) {
      const button = document.createElement("button");
      button.innerText = player.username;
      button.onclick = () => {
        this.activePlayer = player.username;
        this.selectChannel(player.username);
      };
      this.chatSideBar.appendChild(button);

      // Cria um novo espaço de mensagens para cada jogador
      const chatBody = document.createElement("div");
      chatBody.id = `chatBody_player_${player.username}`;
      chatBody.style.display = 'none';
      document.body.appendChild(chatBody);
    }

    // Isso é temporário apenas enquanto não tenho acesso ao DB
    this.sendBasicInfo(player.length);
  }

  selectChannel(channel) {
    // Esconde todos os espaços de chat
    if (this.chatBody)
      this.chatBody.innerHTML = '';
    for (let i = 1; i <= this.numberPlayers; i++) {
      const chatBody = document.getElementById(`chatBody_player_${i}`);
      if (chatBody) {
        chatBody.style.display = 'none';
      }
    }

    // Mostra o espaço de chat do canal selecionado
    const chatBody = document.getElementById(`chatBody_${channel}`);
    if (chatBody) {
      chatBody.style.display = 'flex';
      this.chatBody = chatBody;
      console.log(`Channel switched to ${channel}`);
    }

    document.getElementById("chatHeader").innerText = `Chat - ${channel.charAt(0).toUpperCase() + channel.slice(1)}`;
    this.loadMessages(channel);
  }

  handleWebSocketMessage(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'chat_message') {
      const message = `${data.sender}: ${data.message}`;
      this.storeMessages(data.sender, message);
      this.appendChatMessage(message, data.sender.replace('Player', 'player_'));
      console.log("handleWebSocketMessage " + data.sender.replace('Player', 'player_'));
    } 
    else if (data.type === 'connection_established') {
      console.log("handleWebSocketMessage channel_name: " + channel_name);
    } 
    else if (data.type === 'paddle_update') {
      console.log("handleWebSocketMessage paddle_update: " + data.paddle_x + ", " + data.paddle_y);
    } 
    else if (data.type === 'ball_update') {
      console.log("handleWebSocketMessage ball_update: " + data.ball_x + ", " + data.ball_y);
    } 
    else if (data.type === 'ball_update') {
      console.log("handleWebSocketMessage ball_update: " + data.ball_x + ", " + data.ball_y);
    }
    else {
      console.error("Received unexpected message type:", data.type);
    }
  }

  storeMessages(player, message) {
    const p = player.replace('Player', 'player_');
    console.log("storeMessages " + p);
    if (!this.messages[p])
      this.messages[p] = [];
    this.messages[p].push(message);
  }

  loadMessages(player) {
    const id = player.replace('Player', 'player_');
    this.chatBody.innerHTML = ''; 
    const messages = this.messages[id] || [];
    
    // messages.forEach(message => this.appendChatMessage(message, id));
    if (!this.lastLoadedMessageCount) {
      this.lastLoadedMessageCount = {};
    }
  
    if (this.lastLoadedMessageCount[id] !== messages.length && this.lastLoadedMessageCount[id] !== 0) {
      this.chatBody.innerHTML = ''; // Limpa as mensagens atuais
      messages.forEach(message => this.appendChatMessage(message, id));
      this.lastLoadedMessageCount[id] = messages.length; // Atualiza o último comprimento carregado
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("This is me: " + users.length);
  new Chat(users.length);

  // chat.generatePlayerButtons(3);
})
