import { displayExtendedForm } from "./controlsForm";
import { controls } from "./controlsForm";
import { Game } from "./game";
import { sleep } from "./auxFts";

export class Match {

  constructor(type, gameType, nPlayers, listPlayers, host) {

    console.log("Match created");
    this.type = type; //online or local
    this.gameType = gameType; //match or tournament
    this.numPlayers = nPlayers;
    this.players = listPlayers; //list
    this.hostName = host; // who is the host
    this.winners = [];
    this.id = null; // id so it can be identified in backend
    this.winner = null;

    if (type == "local") { 
      console.log("Local Match");
      this.startLocalMatch();

    } else if (type == "online") {
      //send msg to backend to inform it that match was created with this players and who the host is
      //in return server gives match its id
      //after that match starts at host and clients
      //after game ends inform backend and share result, also each player in the game should have access to it
      //this.finalScore = smthing
    }
  }

  async startLocalMatch() {
    await displayExtendedForm(this.players, this.numPlayers);
    console.log("after displayextended:");
    if (controls) {
      game = new Game(this.numPlayers, controls);
      console.log("THE Winner is: " + game.winner);
    }

    while (this.winner === null) {
      this.winner = game.winnerName;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log("Acabou Match");
    console.log("Winner is: " + this.winner);
  }

  async getWinner() {
    while (this.winner === null) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  
    console.log("getWinner: " + this.winner);
    return this.winner;
  }

}