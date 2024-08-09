import { Match } from "./match";

export class Tournament {
    numPlayers = 2;
    playerNames = [];
    winners = [];

    constructor(number, names) {
        if (!number || !names)
            console.log("deu merda") 
        this.numPlayers = number;
        this.playerNames = names;
        console.log("Entrei no torneio " + this.playerNames);
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
        console.log("Starting tournament");
        this.shuffleNames();
        while (this.playerNames.length > 1) {
            console.log("Scheduling next round" + this.playerNames);
            await this.scheduleNextRound();
        }
        console.log(`Player ${this.playerNames[0]} wins the tournament!`);
        console.log(this.playerNames)

    }

    async scheduleNextRound() {
        const nextRoundPlayers = [];
        console.log("Scheduling next round");
        // Process all matches in the current round
        while (this.playerNames.length > 1) {
            const player1 = this.playerNames.shift();
            const player2 = this.playerNames.shift();

            const match = new Match("local", "tournament", 2, [player1, player2], player1);
            let winner =  await match.getWinner();
            nextRoundPlayers.push(winner);
        }

        // If there's an odd player out, they automatically advance to the next round
        if (this.playerNames.length === 1) {
            nextRoundPlayers.push(this.playerNames.shift());
        }

        // Set up for the next round
        this.playerNames = await nextRoundPlayers;
        console.log("END OF SCHENEXTROUND");
    }
}
