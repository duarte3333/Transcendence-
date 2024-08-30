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
    if (this.game != undefined)
      this.game.destroyer()
    this.game = undefined;
    // const gameForm = document.getElementById("gameForm");
    // if (gameForm)
    //   gameForm.innerHTML = `<h1 class="display-1" style="font-size: 3rem;" >Configure Players</h1>
		// 	<form id="playerForm"> 
		// 		<!-- <p>Choose the number of players bellow</p> -->
		// 		<!-- <input type="number" id="numPlayers" name="numPlayers" min="0" max="20" autocomplete="off" required> -->
		// 		<!-- <input class="display-1" style="font-size: 1rem;" id="numPlayers"></input> -->
		// 		<div class="display-1" style="font-size: 1rem;" id="playerControls"></div>
		// 		<!-- <input type="hidden" id="playerData" name="playerData"> -->
		// 		<!-- <div class="row d-flex justify-content-center"> -->
		// 		<button class="btn btn-outline-dark bodyBtns" id="controlsButton" type="button">Save Configuration</button>
		// 		<!-- </div> -->
		// 	</form>`
  }
}