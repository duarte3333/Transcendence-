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
    this.game = null;

  }

  async startLocalMatch() {
    console.log("starting match")
    const controls = await displayExtendedForm(this.players, this.numPlayers);
    if (controls && this.game == undefined) {
      this.game = new Game(this.numPlayers, controls);
    } else {
      console.log("erro em match game devia estar undefined");
    }
    while (this.winner === null || this.winner === undefined) {
      if (this.game == undefined)
        return ;
      this.winner = this.game.winner;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("Match::Winner is: " + this.winner);
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    if (this.game != undefined)
      this.game.destroyer();
    this.game = undefined;
    const row = document.getElementById("game");
    row.style.display = "none";
    
    if (this.winner != null)
    return this.winner;
  }

  destroyGame() {
    console.log("match ended early")
    this.game.destroyer()
    this.game = undefined;
  }
}