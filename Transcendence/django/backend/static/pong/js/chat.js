// import { chatSocket, channel_name } from "./myWebchatSocket.js";
import { views } from "../../main/js/main.js";
import { getCookie } from "./auxFts.js";

class Chat {
  constructor() {
    this.chatButton = document.getElementById('chatButton');
    this.chatWindow = document.getElementById('chatWindow');
    this.chatInput = document.getElementById('chatInput');
    this.sendChatButton = document.getElementById('sendChatButton');
    this.chatSideBar = document.getElementById('chatSideBar');
    this.blockUserButton = document.getElementById('blockUserButton');
    this.backUserButton = document.getElementById('backUserButton');

    this.unblockUserButton = document.getElementById('unblockUserButton');

    this.SelectedPlayer = null;
    this.chatBody = null;
    this.open = false;
    this.messages = {};
    this.General = {};
    this.socket = undefined;
    this.blockedStatus = false;

    this.setupEventListeners();
    this.chatWindow.style.display = "none";
    this.fetchAndProcessData();
  }

  async fetchAndProcessData() {
    document.getElementById("chatMain").style.display = "none";
    await this.listChatUsers();
  }

  async listChatUsers() {
    fetch("https://localhost/api/user/list", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
      },
    })
		.then(async (response) => {
      const { users } = await response.json();
      console.table("tabela de users: ", users);
      this.listUsers = users;
      const channels = await this.listChannels();
      for (const user of users)
      {

        if (user.id == window.user.id) continue;
          const channel = channels.find((e) => {
            return e.user.length == 2 && e.user.find(u => u.id == user.id) && e.name == ""
          } )

        if (channel) {
          const name = channel.name || channel.user.filter(e => e.id != window.user.id).map(e =>  e.name).join("_") || "tes";
          channel.name = name
          console.log("user. ", user, " channelw: ", channel.name)
        }
        else {
          channels.push({
            id: undefined,
            name: user.username,
            mensagens: [],
            user: [
              {
                "id": window.user.id,
                "name": window.user.username,
              },
              {
                "id": user.id,
                "name": user.username
              }
            ],
            status: 'create',
            zIndex: 5

          })
        }
      }

      this.listchannelsSubscribed = channels.sort((a, b) => {
        const nameA = a.zIndex || (a.name == "Geral" ? -5 : 0)
        const nameB = b.zIndex || (b.name == "Geral" ? -5 : 0)
         return nameA - nameB;
      });
      console.log("channels: " , channels)
      this.generatePlayerButtons(channels);
    })
    .catch((error) => console.error(error));
  }

  async listChannels() {    
    return fetch("https://localhost/api/chat/list", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        "userId": window.user.id
      }),
      redirect: "follow"
    })
      .then(async (response) => {
        const { chat } = await response.json();
        console.log("channelsSubscribed: ", chat)
        this.listchannelsSubscribed = chat;
        return chat
      })
      .catch((error) => console.error(error));
  }
  
  // getUserChannels() {
  //   const userChannelsList = this.listUsers.map(user => {
  //     return {
  //         userId: user.id,
  //         channels: this.listchannelsSubscribed.filter(channel => channel.userId === user.id)
  //     };
  //   });
  //   console.table("User Channels List: ", userChannelsList);
  //   return userChannelsList;
  // }

  setupEventListeners() {
    if (this.chatButton)
      this.chatButton.addEventListener('click', () => this.toggleChatWindow());
    if (this.sendChatButton)
      this.sendChatButton.addEventListener('click', () => this.sendChatMessage());
    if (this.blockUserButton)
      this.blockUserButton.addEventListener('click', () => this.blockUser(this.SelectedPlayer));
    if (this.unblockUserButton)
      this.unblockUserButton.addEventListener('click', () => this.unBlockUser(this.SelectedPlayer));
    if (this.backUserButton)
      this.backUserButton.addEventListener('click', () => {
        this.fetchAndProcessData();
      });
    this.setup();
  }

  blockUser(channel) {
    this.socket.send(JSON.stringify({
      'action': 'block',
      'type': 'block',
      'userId': window.user.id,
      'channelId': channel
    }))
    this.blockedStatus = !this.blockedStatus;
    this.unblockUserButton.style.display = 'flex';
    this.blockUserButton.style.display = 'none';

    console.log("User Status: ", this.blockedStatus);
  }

  unBlockUser(channel) {
    this.blockedStatus = !this.blockedStatus;
    this.unblockUserButton.style.display = 'none';
    this.blockUserButton.style.display = 'flex';
    console.log("User Status: ", this.blockedStatus);
  }


  async setup() {
    while (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      await new Promise(resolve => setTimeout(resolve, 5));
    }
  }

  createChannel(channel) {
    const data = JSON.stringify({
      "user": channel.user,
      "status": "active",
      "mensagens": []
    });
    
    fetch("https://localhost/api/chat/create", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
      },
      body:data
    }).then(async (result) => {
      const { chat } = await result.json()
      channel.id = chat.id
      if (channel.id) channel.button.style.backgroundColor = "yellow"
      this.joinChannel(channel);
    })
  }

  joinChannel(channel){
    this.socket.send(JSON.stringify({
      'action': 'join',
      'type': 'join',
      'channelId': channel.id
    }));
    document.getElementById("chatMain").style.display = "flex";
    this.backUserButton.style.display = "flex";
    document.getElementById("chatHeader").innerText = `Chat - ${channel.name.charAt(0).toUpperCase() + channel.name.slice(1)}`;
    // if (this.unblockUserButton.style.display != 'flex')
    //   this.blockUserButton.style.display = 'flex';
    this.SelectedPlayer = channel.id;
    this.generateUsersButtons(channel);
  }

  createButtonsOnChat(channel) 
  {
    const button = document.createElement("button");
    channel.button = button;
    let username = channel.name;
    button.innerText = username;
    button.id = `chatButton_${username}`
    button.setAttribute("channel", "create")
    if (channel.id) button.style.backgroundColor = "lightblue"
    button.onclick = () => {
      if (channel.id == undefined) {
        this.createChannel(channel);
      } else {
        this.joinChannel(channel)
      }
    };
    this.chatSideBar.appendChild(button);
  }

  createUsersButtonsOnChat(user) 
  {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.gap = "3px";
    div.style.flexDirection = "row"
    const button = document.createElement("button");
    button.style.minWidth = "100px";
    user.button = button;
    let username = user.name || user.username;
    button.innerText = username;
    button.id = `chatButton_${username}`
    button.setAttribute("user", "create")
    if (user.id) button.style.backgroundColor = "lightblue"
    button.onclick = () => {
      // if (channel.id == undefined) {
      //   this.createChannel(channel);
      // } else {
      //   this.joinChannel(channel)
      // }
    };
    const button2 = document.createElement("button");
    button2.innerText = "Block"
    div.append(button, button2)
    this.chatSideBar.appendChild(div);
  }


  generatePlayerButtons(channels) {
    this.chatSideBar.innerHTML = '';

    // this.createButtonsOnChat("General");

    for (const channel of channels) {
      this.createButtonsOnChat(channel);
    }

    // this.sendBasicInfo(length);
  }


  generateUsersButtons(channel) {
    this.chatSideBar.innerHTML = '';

    // this.createButtonsOnChat("General");

    for (const user of channel.user) {
      if (user.id != window.user.id)
      this.createUsersButtonsOnChat(user);
    }

    // this.sendBasicInfo(length);
  }
  selectChannel(channel) {
    this.blockUserButton.style.display = 'flex';
    
    this.appendChatMessage(window.user.id, this.SelectedPlayer);
    
    document.getElementById("chatHeader").innerText = `Chat - ${channel.charAt(0).toUpperCase() + channel.slice(1)}`;
    // console.log("SelectChannel() " + this.SelectedPlayer);
  }

  toggleChatWindow() {
    if (!this.socket)
      this.InitializeWebSocket();
    this.open ? this.chatWindow.style.display = "none" : this.chatWindow.style.display = "flex";
    this.open = !this.open;
  }

  sendChatMessage() {
    const message = this.chatInput.value;
    if (message && this.socket) {
      if (message && this.socket) {
        this.socket.send(JSON.stringify({
          'type': 'chat_message',
          'action': 'chat_message',
          'message': message,
          'userId': window.user.id,
        }));
        this.chatInput.value = '';
      }
      const fullMessage = `${window.user.id}: ${message}`;
      // console.log("sendChatMessage() ", fullMessage);
    } else {
      console.error("sendChatMessage() Message not sent: invalid conditions.");
      this.chatInput.value = '';
    }
  }

  appendChatMessage(sender, receiver) {
    const chatBodyChildren = document.getElementById(`chatBodyChildren`);
    chatBodyChildren.innerHTML = "";
  }

  InitializeWebSocket() {
    const wsUrl = `ws://localhost:8000/ws/chat/${window.user.id}/`;
  
    this.socket = new WebSocket(wsUrl);
    if (this.socket) {
        // console.log("this.socket object" + this.socket.readyState + " this.socket url " + this.socket.url);
        window.chatchatSocket = this.socket;
    }
  
    this.socket.onopen = () => {
        // console.log("WebchatSocket connection established. Status: ", this.socket.readyState);
        // if (this.socket.readyState === WebSocket.OPEN) {
        //   const message = JSON.stringify({
        //       'action': 'join',
        //       'userId': window.user.id,
        //       'type': "run"
        //   });
        //   this.socket.send(message);
        // }
        // else {
          // console.error("WebSocket is not open. Current state:", this.socket.readyState)
        // }
    }


    this.socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log("Received message data = ", data);

        if (data.action === 'chat_message') {
          this.handleWebchatSocketData(data);
          // console.log("socket.onmessage ", data.message);
        }
        else if (data.action == 'join')
        {
          this.handleWebchatSocketData(undefined, true);
          for (const message of data.message)
          {
            this.handleWebchatSocketData(message)
          }
        }
        else if (data.action == "alertChannelCreated")
        {
          const user = data.user;
           for (const channel of this.listchannelsSubscribed )
           {
              const isCheck =  user.length ==  channel.user.length && user.length == (channel.user.filter(e => user.find(u => u.id == e.id))).length;
              // console.log("alertChannelCreated: ", isCheck , " u: ", user, " c: ", channel.user)
              if (isCheck)
              {
                channel.id = data.channelId;
                if (channel.id) channel.button.style.backgroundColor = "lightgreen"
                
                break;
              }
           }
        }
    }
  
    this.socket.onclose = function(e) {
        console.log("WebchatSocket connection closed");
    }
  
    this.socket.onerror = function(e) {
        console.log("WebchatSocket error: ", e);
    }
  
    window.addEventListener('beforeunload', () => {
        if (this.socket) {
            this.socket.close();
        }
    })
  }

  handleWebchatSocketData(data, isClear = false) {
    if (isClear == true)
      chatBodyChildren.innerHTML = '';
    else 
    { 
      const { message, userId} = data;

      // console.log("handleWebchatSocketData() Message received from server:", data);
      const fullMessage = `${userId}: ${message}`;
      const chatBodyChildren = document.getElementById(`chatBodyChildren`);
      chatBodyChildren.innerHTML += `<p>${fullMessage}</p>`;
      // console.log("handleWebchatSocketData() ", fullMessage);
    }

  }
}

views.setElement("/chat", (state) => {
  document.getElementById("chatContainer").style.display = state;
  if ("block") {
    window.chat = new Chat();
  }
  else {
    //Supostamente, tenho de destruir a chatSocket
    //remover eventListeners, 
    window.chat = undefined;
  }
})
.setEvents();

// document.addEventListener("DOMContentLoaded", function() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const username = urlParams.get('username') || 'test_user';
// })

