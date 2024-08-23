import { initializeWebSocket, socket, channel_name } from "./myWebSocket.js";
import { views } from "../../main/js/main.js";

class Chat {
  constructor() {
    this.chatButton = document.getElementById('chatButton');
    this.chatWindow = document.getElementById('chatWindow');
    this.chatInput = document.getElementById('chatInput');
    this.sendChatButton = document.getElementById('sendChatButton');
    this.chatSideBar = document.getElementById('chatSideBar');
    this.blockUserButton = document.getElementById('blockUserButton');
    this.unblockUserButton = document.getElementById('unblockUserButton');

    this.SelectedPlayer = null;
    this.chatBody = null;
    this.open = false;
    this.messages = {};
    this.General = {};
    this.BlockedStatus = false;

    this.chatHash = null;
    this.messagesHistory = new Map();

    this.setupEventListeners();
    this.chatWindow.style.display = "flex";
  }

  
  setupEventListeners() {
    if (this.chatButton)
      this.chatButton.addEventListener('click', () => this.toggleChatWindow());
    if (this.sendChatButton)
      this.sendChatButton.addEventListener('click', () => this.sendChatMessage());
    if (this.blockUserButton)
      this.blockUserButton.addEventListener('click', () => this.blockUser());
    if (this.unblockUserButton)
      this.unblockUserButton.addEventListener('click', () => this.unBlockUser());
    this.setup();
  }

  blockUser() {
    if (socket && this.SelectedPlayer && !this.BlockedStatus) {
      console.log("User blocked: ", this.SelectedPlayer);
      socket.send(JSON.stringify({
        'type': 'blocked_conversation',
        'user': this.SelectedPlayer,
        'hash': this.chatHash,
      }))
      this.BlockedStatus = !this.BlockedStatus;
      this.unblockUserButton.style.display = 'flex';
      this.blockUserButton.style.display = 'none';
    }
    console.log("User Status: ", this.BlockedStatus);
  }

  unBlockUser() {
    if (socket && this.SelectedPlayer && this.BlockedStatus) {
      console.log("User unblocked: ", this.SelectedPlayer);
      socket.send(JSON.stringify({
        'type': 'unblocked_conversation',
        'user': this.SelectedPlayer,
        'hash': this.chatHash,
      }))
      this.BlockedStatus = !this.BlockedStatus;
      this.unblockUserButton.style.display = 'none';
      this.blockUserButton.style.display = 'flex';
    }
    console.log("User Status: ", this.BlockedStatus);
  }

  createAndStoreHash(speaker, audience, context) {

    console.log("createAndStoreHash() speaker " + speaker);
    console.log("createAndStoreHash() audience " + audience);

    this.chatHash = createChatHash(speaker, audience, context);
    localStorage.setItem(`${speaker}_${audience}_chat`, this.chatHash);
  }

  async setup() {
    while (socket.readyState !== WebSocket.OPEN) {
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    this.generatePlayerButtons(window.user.id);
  }

  sendBasicInfo(length) {
    if (socket && socket.readyState === WebSocket.OPEN) {

      console.log("Mensagem que será enviada ao Backend: " + window.user.id);
      socket.send(JSON.stringify({
        type: 'room_info',
        'numplayers': length,
        'players': window.user.id
      }));
    }
  }

  createButtonsOnChat(User) {
    const button = document.createElement("button");
        
    button.innerText = User;
    button.id = `chatButton_${User}`
    button.onclick = () => {
      this.SelectedPlayer = User;
      this.selectChannel(User);
    };
    this.chatSideBar.appendChild(button);
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
    //Apenas para testes
    // localStorage.clear();
    let User;
    if (this.SelectedPlayer === 'Liberal') {
      User = JSON.parse(ActiveUser2)[0].username;
    } else {
      User = JSON.parse(ActiveUser)[0].username;
    }
    //FIm dos Testes

    this.blockUserButton.style.display = 'flex';
    
    //let hash = localStorage.getItem(hashkey);
    this.createAndStoreHash(User, channel, 'chat');
    if (!this.messagesHistory.has(this.chatHash))
      this.messagesHistory.set(this.chatHash, []);
    

    console.log("User ", User);
    console.log("channel ", channel);
    console.log("hash ", this.chatHash);

    this.appendChatMessage(User, this.SelectedPlayer);
    
    document.getElementById("chatHeader").innerText = `Chat - ${channel.charAt(0).toUpperCase() + channel.slice(1)}`;
    console.log("SelectChannel() " + this.SelectedPlayer);
  }

  toggleChatWindow() {
    if (!socket)
      initializeWebSocket();
    this.open ? this.chatWindow.style.display = "none" : this.chatWindow.style.display = "flex";
    this.open = !this.open;
  }

  sendChatMessage() {
    const message = this.chatInput.value;
    if (message && socket && this.SelectedPlayer != null && !this.BlockedStatus) {
      //Isso está aqui para teste e simulação
      let User;
      if (this.SelectedPlayer === 'Liberal') {
        User = JSON.parse(ActiveUser2)[0].username;
      } else {
        User = JSON.parse(ActiveUser)[0].username;
      }

      if (message && socket && this.chatHash != null) {
        socket.send(JSON.stringify({
          'type': 'chat_message',
          'message': message,
          'sender': User,
          'receiver': this.SelectedPlayer,
          'hash': this.chatHash
        }));
        this.chatInput.value = '';
      }

      const storedHash = localStorage.getItem(`${User}_${this.SelectedPlayer}_chat`);
      console.log("sendChatMessage() storedHash", storedHash);
      const fullMessage = `${User}: ${message + "<br>"}`;
      this.storeMessages(User, this.SelectedPlayer, this.chatHash, fullMessage);
      this.addToMessagesHistory(this.chatHash, fullMessage); 
      this.appendChatMessage(User, this.SelectedPlayer);
    } else {
      console.error("sendChatMessage() Message not sent: invalid conditions.");
      this.chatInput.value = '';
    }
  }

  appendChatMessage(sender, receiver) {
    const chatBodyChildren = document.getElementById(`chatBodyChildren`);
    // console.log("appendChatMessage() hash ", hash);
    const storedHash = localStorage.getItem(`${sender}_${receiver}_chat`);

    console.log("appendChatMessage() storedHash: " + storedHash);

    if (!this.messagesHistory.has(storedHash))
      this.messagesHistory.set(storedHash, []);
    

    let messages = this.messagesHistory.get(storedHash);
    chatBodyChildren.innerHTML = "";
      messages.forEach((msg) => chatBodyChildren.innerHTML += msg + "\n")
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

views.setElement("/chat", (state) => {
  document.getElementById("chatContainer").style.display = state;
  if ("block") {
    initializeWebSocket(window.user.id);
    window.chat = new Chat();
  }
  else {
    //Supostamente, tenho de destruir a socket
    //remover eventListeners, 
    windows.chat = undefined;
  }
})
.setEvents();

document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username') || 'test_user';
})

