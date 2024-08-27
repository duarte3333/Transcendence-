import { displayExtendedForm } from "./controlsForm.js";
import { Game } from "./game.js";

export class Match {

  constructor(type, gameType, nPlayers, listPlayers, host) {

    // console.log("Match::Match created");
    this.type = type; //online or local
    this.gameType = gameType; //match or tournament
    this.numPlayers = nPlayers;
    this.players = listPlayers; //list
    this.hostName = host; // who is the host
    this.winners = [];
    this.id = null; // id so it can be identified in backend
    this.winner = null;

  }

  async startLocalMatch() {
    console.log("starting match")
    const controls = await displayExtendedForm(this.players, this.numPlayers);
    let game;
    if (controls) {
      game = new Game(this.numPlayers, controls);
    }
    while (this.winner === null || this.winner === undefined) {
      this.winner = game.winner;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("Match::Winner is: " + this.winner);
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    game.destroyer();
    const row = document.getElementById("game");
    row.style.display = "none";
    
    return this.winner;
  }
}