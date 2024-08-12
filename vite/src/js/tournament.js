import { Match } from "./match";

export class Tournament {
    numPlayers = 2;
    playerNames = [];
    winners = [];

    constructor(number, names) {
        if (!number || !names)
            console.log("Error") 
        this.numPlayers = number;
        this.playerNames = names;
        console.log("Tournament::Entrei no torneio " + this.playerNames);
        console.log(this.playerNames);
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
        console.log(`Tournament::Player ${this.playerNames[0]} wins the tournament!`);
		document.getElementById('nameForm').style.display = 'none';
		document.getElementById('gameForm').style.display = 'none';
		document.getElementById('game').style.display = 'none';
        console.log(this.playerNames)

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
            console.log("Tournament::winner", winner);
            nextRoundPlayers.push(winner);
        }

        // If there's an odd player out, they automatically advance to the next round
        if (this.playerNames.length === 1) {
            nextRoundPlayers.push(this.playerNames.shift());
        }

        // Set up for the next round
        this.playerNames = await nextRoundPlayers;
    }
}
