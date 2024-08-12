import { displayExtendedForm } from "./controlsForm";
import { controls } from "./controlsForm";
import { Game } from "./game";

export class Match {

  constructor(type, gameType, nPlayers, listPlayers, host) {

    console.log("Match::Match created");
    this.type = type; //online or local
    this.gameType = gameType; //match or tournament
    this.numPlayers = nPlayers;
    this.players = listPlayers; //list
    this.hostName = host; // who is the host
    this.winners = [];
    this.id = null; // id so it can be identified in backend
    this.winner = null;

    if (type == "local") { 
      //this.startLocalMatch();

    } else if (type == "online") {
      //send msg to backend to inform it that match was created with this players and who the host is
      //in return server gives match its id
      //after that match starts at host and clients
      //after game ends inform backend and share result, also each player in the game should have access to it
      //this.finalScore = smthing
    }
  }

  async startLocalMatch() {
    console.log("Match::entrou no display extended form");
    await displayExtendedForm(this.players, this.numPlayers);
    let game;
    console.log("Match::after displayextended:");
    if (controls) {
      game = new Game(this.numPlayers, controls);
    }
    while (this.winner === null || this.winner === undefined) {
      this.winner = game.winnerName;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("Match::Acabou Match");
    console.log("Match::Winner is: " + this.winner);
    return this.winner;
  }
}