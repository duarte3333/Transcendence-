import { Match } from "./match.js";
import { getCookie } from "./auxFts.js";

export class Tournament {
    numPlayers = 2;
    playerNames = [];
    winners = [];
    leaderBoard = [];
    tournamentButton = null;
    socket = null;
    match = undefined;

    constructor(number, names) {
        if (!number || !names)
            console.log("Error") 
        // this.chatSideBar = document.getElementById('chatSideBar');
        // this.chatWindow = document.getElementById('chatWindow');
        // this.porfileButton = document.getElementById('profileButtonChat');
        // this.backUserButton = document.getElementById('backUserButton');
        
        this.numPlayers = number;
        this.playerNames = names;
        this.channelId = undefined;
        // console.log("Tournament::Entrei no torneio " + this.playerNames);
        // console.log(this.playerNames);

        // this.InitializeWebSocket();
        // this.setup();
        // this.startTournament();
        this.createButtonsTournament();
        // this.chatWindow.style.display = "flex";
        // this.porfileButton.style.display = "none";
        // document.getElementById('inviteButtonChat').style.display = "none";
        // document.getElementById("chatMain").style.display = "none";

        this.setup().then(() => {
            this.startTournament();
            // this.createButtonsTournament();
            // this.chatWindow.style.display = "flex";
            // this.porfileButton.style.display = "none";
            // document.getElementById('inviteButtonChat').style.display = "none";
            // document.getElementById("chatMain").style.display = "none";
            // this.backUserButton.style.display = "none";
        });
    }

    async listChannels() {    
        return fetch(window.hostUrl + "/api/chat/list", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify({
            "userId": window.user.id,
            "name": "Tournament Channel",
          }),
          redirect: "follow"
        })
        .then(async (response) => {
        const { chat } = await response.json();
        console.log("channelsSubscribed: ", chat)
        // if (chat && chat.)
        // this.listchannelsSubscribed = chat;
        return chat
        })
        .catch((error) => console.error(error));
    }

      

    shuffleNames() {
        let currentIndex = this.playerNames.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [this.playerNames[currentIndex], this.playerNames[randomIndex]] = [this.playerNames[randomIndex], this.playerNames[currentIndex]];
        }
    }

    async setup() {
        // while (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        //   await new Promise(resolve => setTimeout(resolve, 10));
        // }
    }

    async startTournament() {
        this.shuffleNames();
        await this.scheduleNextRound();
        // if (this.socket == undefined)
        //     return ;
        // console.log(`Tournament::Player ${this.playerNames[0]} wins the tournament!`);
        this.leaderBoard.push(this.playerNames[0]);
        // console.log("player leaderboard =", this.leaderBoard);
		const nameform = document.getElementById('nameForm');
        if (nameform != undefined)
            nameform.style.display = 'none'
		const gameForm = document.getElementById('gameForm');
        if (gameForm != undefined)
            gameForm.style.display = 'none';
		const game = document.getElementById('game');
        if (game != undefined)
            game.style.display = 'none';
        // console.log(this.playerNames)
        this.showLeaderBoard();
        // this.socket.close();
    }



    async createButtonsTournament() 
    {
        // this.chatSideBar.innerHTML = '';
        // document.getElementById('chatBodyChildren').innerHTML = '';
        // const button = document.createElement("button");
        // button.innerText =  "Tournament Channel";
        // button.id = `tournament`
        // button.setAttribute("channel", "create")

        // if (this.channelId) button.style.backgroundColor = "lightblue"
        // button.onclick =  async () => {
            const chat = await this.listChannels();
            if (chat.length == 0) {  
                this.createChannelTournament();
            } 
            else {
                console.log("AQUI CHAT = ", chat)
                this.channelId = chat[0].id;
                window.chat.joinChannel(chat[0]);
                // console.log("chat name == ", chat[0].name)
                // if (chat[0].name == 'Tournament Channel') {
                //     const button1 = document.getElementById('profileButtonChat');
                //     if (button1)
                //         button1.style.display = 'none';
                //     const button2 = document.getElementById('inviteButtonChat');
                //     if (button2)
                //         button2.style.display = 'none';
                // }
            }
            // this.chatSideBar.style.width = "40%";
        // };
        // this.tournamentButton = button;
        // this.chatSideBar.appendChild(button);
    }

    createChannelTournament() {
        const data = JSON.stringify({
            "user": [{'id': window.user.id, 'name': window.user.display_name}],
            "name": "Tournament Channel",
            "status": "active",
            "mensagens": [{"userId": window.user.id, "message": "Tournament Starting", "display_name": "Tournament"}],
            
        });
        fetch(window.hostUrl + "/api/chat/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body:data
        }).then(async (result) => {
            const { chat } = await result.json()
            console.log("chat name == ", chat.name)
            if (chat.name == 'Tournament Channel') {
                const button1 = document.getElementById('profileButtonChat');
                if (button1)
                    button1.style.display = 'none';
                const button2 = document.getElementById('inviteButtonChat');
                if (button2)
                    button2.style.display = 'none';
            }
                
            window.chat.joinChannel(chat);
            this.channelId = chat.id
            console.log("this.channelId ", chat);
            // if (this.channelId) this.tournamentButton.style.backgroundColor = "blue"
            // this.joinChannelTournament();
        })
    }

    // joinChannelTournament(){
    //     const data = JSON.stringify({
    //       'action': 'tournament_join',
    //       'type': 'tournament_join',
    //       'channelId': this.channelId,
    //       'userId': window.user.id,
    //     });
    //     this.socket.send(data);
    //     document.getElementById("chatMain").style.display = "flex";
    //     this.backUserButton.style.display = "flex";
    //     document.getElementById("chatHeader").innerText = `Chat - Tournament`;
        
    //     // if (this.unblockUserButton.style.display != 'flex')
    //     //   this.blockUserButton.style.display = 'flex';
    //     // this.generateUsersButtons(channel);
    // }

    sendTournamentMessage(player1, player2) {
        const message = `"=====Game Between===== ", ${player1} e ${player2}`;
        setTimeout(() => {
            // alert('ALERTA')
            window.chat.sendChatMessage(message, 'Tournament')
        }, 1000);
        // if (message && this.socket) {
        //     this.socket.send(JSON.stringify({
        //     'type': 'tournament_call',
        //     'action': 'tournament_call',
        //     'message': message,
        //     'userId': window.user.id,
        //     }));
        // }
        
    }

    async scheduleNextRound() {
        const nextRoundPlayers = [];
        // Process all matches in the current round
        while (this.playerNames.length > 1) {
            // if (this.socket == undefined)
            //     return ;
            const player1 = this.playerNames.shift();
            const player2 = this.playerNames.shift();
            console.log("=====Game Between===== ", [player1, player2])
            this.sendTournamentMessage(player1, player2);
            this.match = new Match("local", "tournament", 2, [player1, player2], player1);
            let winner =  await this.match.startLocalMatch();
            // console.log("Tournament::winner", winner);
            nextRoundPlayers.push(winner);
            // this.leaderBoard.
            this.leaderBoard.push(winner == player1 ? player2 : player1);
        }

        // If there's an odd player out, they automatically advance to the next round
        if (this.playerNames.length === 1) {
            nextRoundPlayers.push(this.playerNames.shift());
        }

        // Set up for the next round
        this.playerNames = nextRoundPlayers;
    }

    InitializeWebSocket() {
        // const wsUrl = `wss://${window.location.host}/wss/tournament/${window.user.id}/`;
      
        // this.socket = new WebSocket(wsUrl);
        // // console.log('socker ==> ', this.socket);
        
        // if (this.socket) {
        //     window.chatchatSocket = this.socket;
        //     if (window.chat)
        //         window.chat.socket.close();
        // }
      
        // this.socket.onopen = () => {
        //     console.log("WebSocket connection established.");
        // }
    
    
        // this.socket.onmessage = (e) => {
        //     const data = JSON.parse(e.data);
        //     console.log("Received message data = ", data);
    
        //     if (data.action === 'chat_message') {
        //       this.handleWebchatSocketData(data);
        //     }
        //     else if (data.action === 'tournament_join') {
        //       this.handleWebchatSocketDataTournament(data);
        //     }
        //     else if (data.action === 'tournament_call') {
        //         this.handleWebchatSocketDataTournament(data);
        //     }
        // }
      
        // this.socket.onclose = function(e) {
        //     console.log("WebchatSocket connection closed");
        // }
      
        // this.socket.onerror = function(e) {
        //     console.log("WebchatSocket error: ", e);
        // }
      
        // window.addEventListener('beforeunload', () => {
        //     if (this.socket) {
        //         this.socket.close();
        //     }
        // })
    }

    handleWebchatSocketDataTournament(data, isClear = false) {
        if (isClear == true)
            chatBodyChildren.innerHTML = '';
          else 
          { 
            const { message } = data;     
            const fullMessage = `${message}`;
            const chatBodyChildren = document.getElementById(`chatBodyChildren`);
            chatBodyChildren.innerHTML += `<p>${fullMessage}</p>`;
        }
    }

    showLeaderBoard() {
        const container = document.getElementById("tournamentBody");
        if (container == undefined)
            return ;
        const leaderboardDiv = document.createElement('div');
        leaderboardDiv.className = 'container mt-4';
        leaderboardDiv.id = 'leaderboardDiv';

        // Add a title
        const title = document.createElement('h2');
        title.innerText = 'Tournament Leaderboard';
        leaderboardDiv.appendChild(title);

        // Create a Bootstrap-styled table for the leaderboard
        const table = document.createElement('table');
        table.className = 'table table-striped';

        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const rankHeader = document.createElement('th');
        rankHeader.innerText = 'Rank';
        const nameHeader = document.createElement('th');
        nameHeader.innerText = 'Player';
        headerRow.appendChild(rankHeader);
        headerRow.appendChild(nameHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        for (let i = this.numPlayers - 1; i >= 0; i--) {
            const row = document.createElement('tr');
            const rankCell = document.createElement('td');
            rankCell.innerText = this.numPlayers - i; // Rank starts from 1
            const nameCell = document.createElement('td');
            nameCell.innerText =  this.leaderBoard[i];
            row.appendChild(rankCell);
            row.appendChild(nameCell);
            tbody.appendChild(row);
        }

        table.appendChild(tbody);

        // Append the table to the leaderboard container
        leaderboardDiv.appendChild(table);
        container.appendChild(leaderboardDiv);
    }
    
    destroyTournament() {
        if (this.match != undefined) {
            this.match.destroyGame();
            this.match = undefined;
        }
        // if (this.socket != undefined) {
        //     this.socket.close();
        //     this.socket = undefined;
        // }
    }
}
