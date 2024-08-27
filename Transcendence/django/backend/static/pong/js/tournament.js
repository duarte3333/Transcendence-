import { Match } from "./match.js";

export class Tournament {
    numPlayers = 2;
    playerNames = [];
    winners = [];
    leaderBoard = [];

    constructor(number, names) {
        if (!number || !names)
            console.log("Error") 
        this.numPlayers = number;
        this.playerNames = names;
        // console.log("Tournament::Entrei no torneio " + this.playerNames);
        // console.log(this.playerNames);
        this.startTournament();
    }

    shuffleNames() {
        let currentIndex = this.playerNames.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [this.playerNames[currentIndex], this.playerNames[randomIndex]] = [this.playerNames[randomIndex], this.playerNames[currentIndex]];
        }
    }

    async startTournament() {
        this.shuffleNames();
        while (this.playerNames.length > 1) {
            await this.scheduleNextRound();
        }
        // console.log(`Tournament::Player ${this.playerNames[0]} wins the tournament!`);
        this.leaderBoard.push(this.playerNames[0]);
        // console.log("player leaderboard =", this.leaderBoard);
		document.getElementById('nameForm').style.display = 'none';
		document.getElementById('gameForm').style.display = 'none';
		document.getElementById('game').style.display = 'none';
        // console.log(this.playerNames)
        this.showLeaderBoard();

    }

    async scheduleNextRound() {
        const nextRoundPlayers = [];
        // Process all matches in the current round
        while (this.playerNames.length > 1) {
            const player1 = this.playerNames.shift();
            const player2 = this.playerNames.shift();
            console.log("=====Game Between===== ", [player1, player2])
            const match = new Match("local", "tournament", 2, [player1, player2], player1);
            let winner =  await match.startLocalMatch();
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
        this.playerNames = await nextRoundPlayers;
    }

    showLeaderBoard() {
        const container = document.getElementById("tournamentBody");
        const leaderboardDiv = document.createElement('div');
        leaderboardDiv.className = 'container mt-4';

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
}
