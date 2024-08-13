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


    this.chatHash = null;
    this.messagesHistory = new Map();
    // this.connectWebSocket();

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

  createAndStoreHash(speaker, audience, context) {

    console.log("createAndStoreHash() speaker " + speaker);
    console.log("createAndStoreHash() audience" + audience);

    this.chatHash = createChatHash(speaker, audience, context);
    localStorage.setItem(`${speaker}_${audience}_chatHash`, this.chatHash);
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

  createButtonsOnChat(User) {
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

  generatePlayerButtons() {
    this.chatSideBar.innerHTML = '';

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
    this.createButtonsOnChat("General");

    for (let i = 0; i < length; i++)
      this.createButtonsOnChat(User);

    this.sendBasicInfo(length);
  }

  selectChannel(channel) {
    let showtext = "";
    if (!this.messages[`chatBody_${channel}`])
      this.messages[`chatBody_${channel}`] = [];

    for (let element of this.messages[`chatBody_${channel}`])
      showtext += element.message;
    console.log(this.SelectedPlayer);
    // console.log("--SeletectChannel---------");
    // console.log(showtext);
    // console.log("-----------");
    document.getElementById("chatBodyChildren").innerHTML = showtext;
    
    document.getElementById("chatHeader").innerText = `Chat - ${channel.charAt(0).toUpperCase() + channel.slice(1)}`;
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
    if (message && socket && this.SelectedPlayer != null) {

      let User;

      if (this.SelectedPlayer === 'Liberal') {
        User = JSON.parse(ActiveUser2)[0].username;
      } else {
        User = JSON.parse(ActiveUser)[0].username;
      }

      console.log("this.speaker " + User);
      console.log("this.SelectedPlayer " + this.SelectedPlayer);

      localStorage.clear();
      const hashkey = `${User}_${this.SelectedPlayer}_chatHash`;
      let hash = localStorage.getItem(hashkey);
      
      if (hash == undefined) {
        this.createAndStoreHash(User, this.SelectedPlayer, 'chat');
        hash = localStorage.getItem(hashkey);
      }
      this.chatHash = hash;
      console.log("this.chatHash() Hash: " + this.chatHash);
      if (message && socket && hash != null) {
        socket.send(JSON.stringify({
          'type': 'chat_message',
          'message': message,
          'sender': User,
          'receiver': this.SelectedPlayer,
          'hash': hash
        }));
        this.chatInput.value = '';
      }

      const fullMessage = `${User}: ${message + "<br>"}`;
      this.storeMessages(User, this.SelectedPlayer, hash, fullMessage);
      this.addToMessagesHistory(hash, fullMessage);  // Adiciona ao Map

      const playerId = this.SelectedPlayer.replace('Player', 'player_');

      this.appendChatMessage(fullMessage, this.SelectedPlayer);
    } else {
      console.error("sendChatMessage() Message not sent: invalid conditions.");
    }
  }

  storeMessages(sender, receiver, hash, message) {
    if (!this.messagesHistory.has(hash)) {
      this.messagesHistory.set(hash, []);
    }

    this.messagesHistory.get(hash).forEach((msg, index) => {
      console.log(`Message ${index + 1}: ${msg}`);
    });
  }

  addToMessagesHistory(hash, message) {
    if (!this.messagesHistory.has(hash)) {
      this.messagesHistory.set(hash, []);
    }
    this.messagesHistory.get(hash).push(message);
    console.log(`Added to messagesHistory: Hash ${hash}, Message: ${message}`);
    this.messagesHistory.get(hash).forEach((msg, index) => {
      console.log(`Message ${index + 1}: ${msg}`);
    });
  } 

  appendChatMessage(message, player) {
    console.log(`appendChatMessage() chatBody_${player}`);
    const chatBodyChildren = document.getElementById(`chatBody_${player}`);

    const line = message + '\n';
    if (chatBodyChildren) {
      chatBodyChildren.innerHTML += `<div>${line}</div>`;
      // chatBodyChildren.style.display = 'flex';
      chatBodyChildren.style.flexDirection = 'column';
    } else {
      console.error(`chatBodyChildren not found for player: ${player}`);
    }
  }
}


// Para solucionar o caso de usuários iguais terem o mesmo hash, eu poderei
//acrescentar a esse hash o email do user. Assim garantimos que enquanto o 
//user estiver logado ele terá acesso aos chatPrivados que ele tinha na 
//sessão anterior.

function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + c
  }
  return hash >>> 0; // Converte para um número não negativo de 32 bits
}

export function createChatHash(speaker, audience, context) {
  const names = [speaker, audience].sort();
  
  const usernamesContext = `${names.join("_")}_${context})`;

  const hash = djb2Hash(usernamesContext);

  return hash.toString(16);
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
