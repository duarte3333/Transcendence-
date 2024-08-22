import {views} from "../../main/js/main.js"
// import { initializeWebSocket, socket, channel_name } from "./myWebSocket.js";
// import {secureElement} from "../../main/js/main.js"	
import { getCookie } from "./auxFts.js";


views.setElement("/home", async (state) => {
	const homeBody = document.getElementById("homeBody");
	if (state == "block") {
		homeBody.innerHTML = 
		`<div class="row justify-content-center align-items-center" style="margin-bottom: 5rem; margin-top: 4rem;">
		<h1 class="display-1 text-center">Welcome to Pong</h1>
	</div>
	<div class="displayDiv">
		<div class="row justify-content-center gap-3" style="margin-bottom: 1rem;">
			<button id="playOnline" type="button" class="btn btn-outline-dark w-25 bodyBtns">Play online</button>
		</div>
		<div class="row justify-content-center gap-3" style="margin-bottom: 3rem;">
			<button id="playLocal" type="button" class="btn btn-outline-dark w-25 bodyBtns">Play local</button>
		</div>
	</div>
		`
		document.getElementById('playOnline').addEventListener('click', (event) => nextPage(event, "playOnline"));
		document.getElementById('playLocal').addEventListener('click', (event) => nextPage(event, "playLocal"));
	// 	this.setEvents(
	// 		[ "playOnline", "click",  (event) => nextPage(event, "playOnline") ],
	// 		[ "playLocal", "click",  (event) => nextPage(event, "playLocal") ] ,
	// 	);
	}
	views.get("/navbar").display(state);
	homeBody.style.display = state;
	views.get("/footer").display(state);
})
.setChilds(["/navbar", "/footer"])
.setEvents(
	[ "playOnline", "click",  (event) => nextPage(event, "playOnline") ],
	[ "playLocal", "click",  (event) => nextPage(event, "playLocal") ] ,
);

// document.addEventListener('DOMContentLoaded', function() {
// 	const playOnline = document.getElementById("playOnline");
// 	playOnline.addEventListener('click', (event) => {
// 		nextPage(event, "playOnline");
// 	});

// 	const playLocal = document.getElementById("playLocal");
// 	playLocal.addEventListener('click', (event) => {
// 		nextPage(event, "playLocal");
// 	});
// })

function nextPage(event, type) {
	console.log("type == " + type);
	const oldParent = event.target.closest('.displayDiv');
    if (!oldParent) 
		return;
	oldParent.style.setProperty('display', 'none', 'important');

	const container = event.target.closest('.container');
	if (!container) 
		return;

	const div = document.createElement('div');
	div.id = type +  "div";

	const rowButtons = document.createElement('div');
	rowButtons.className = "row justify-content-center gap-3";
	rowButtons.style.marginBottom = "1.5rem";

	const match = document.createElement('button');
	match.className = "btn btn-outline-dark w-25 bodyBtns";
	match.id = "button_1";
	match.type = "button";
	match.textContent = "Match";
	if (type == "playOnline")
		match.addEventListener('click', onlineMatch);
	else {
		match.addEventListener('click', () => {
			views.urlLoad('/game');
		});
	}
	rowButtons.appendChild(match);

	const tournament = document.createElement('button');
	tournament.className = "btn btn-outline-dark w-25 bodyBtns";
	tournament.id = "button_2";
	tournament.type = "button";
	tournament.textContent = "Tournament";
	if (type == "playLocal") {
		tournament.addEventListener('click', () => {
			views.urlLoad("/tournament/local")
		});
	}
	rowButtons.appendChild(tournament);

	const rowBack = document.createElement('div');
	rowBack.className = "row d-flex align-items-center";

	let back = document.createElement('div');
	back.className = "d-flex justify-content-center";
	back.innerHTML = `
		<button id="${type}button" class="btn btn-dark rounded-circle p-2 lh-1 changeButton" type="button" style="font-size: 100%">
        	<svg class="bi" width="20" height="20"><image class="iconImg" width="20" height="20" xlink:href="/static/pong/img/return.png"></image></svg>
        </button>
	`;
	
	rowBack.appendChild(back);
	div.appendChild(rowButtons);
	div.appendChild(rowBack);
	container.appendChild(div);
	document.getElementById(`${type}button`).addEventListener('click', () => {
		goBack(div, oldParent);
	});
}

function goBack(div, oldParent) {
	div.remove();
	oldParent.style.setProperty('display', 'block', 'important');
}

function onlineMatch() {

	const button_1 = document.getElementById("button_1");
	const button_2 = document.getElementById("button_2");

	button_1.innerText = "Normal";
	button_2.innerText = "Fun";

	button_1.removeEventListener("click", onlineMatch);
	// button_2.removeEventListener("click", playOnlineTournament());

	button_1.addEventListener("click", (event) => {
		playOnlineMatch(event, "Normal");
	});
	button_2.addEventListener("click", (event) => {
		playOnlineMatch(event, "Fun");
	});
}





function playOnlineMatch(event, type, numberPlayers = 2) {

	const container = event.target.closest('.container');
	if (!container) return;
	container.innerHTML = `<div class="row justify-content-center align-items-center" style="margin-bottom: 7rem; margin-top: 3rem;">
	<h5 class="display-1 text-center" style="font-size:3.5rem">Searching for an opponent...</h5>
	</div>
	<div class="row justify-content-center align-items-center">
		<div class="spinner-border text-primary" role="status"></div>
	</div>`;


	//request match to backend aqui

	const data = JSON.stringify({
		"players": [],
		"type": type,
		"number_of_players": numberPlayers
	});
	
	fetch('https://localhost/api/game/match', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: data,
    })
    .then(async (response) => {
		const { game } = await response.json();
		views.urlLoad(`/game?id=${game.id}&type=online`);

		// function checkConditionUntilTimeout() {
		// 	let attempts = 0;
		// 	const maxAttempts = 30;
		
		// 	const intervalId = setInterval(() => {
		// 		attempts++;
		
		// 		// Sua condição de verificação aqui
		// 		const conditionMet = yourConditionCheckFunction(); // Substitua isso pela sua função de verificação
		
		// 		if (conditionMet) {
		// 			console.log("Condição satisfeita!");
		// 			clearInterval(intervalId); // Para o intervalo se a condição for satisfeita
		// 		} else if (attempts >= maxAttempts) {
		// 			console.log("Tempo limite atingido, condição não satisfeita.");
		// 			clearInterval(intervalId); // Para o intervalo se atingir o tempo limite
		// 		}
		
		// 		console.log(`Tentativa ${attempts}`);
		// 	}, 1000); // Checa a cada 1 segundo (1000 milissegundos)
		// }
		
		console.log(game)
		console.log(game.id)
		// initializeWebSocket(game.id, window.user.id);
		// console.log(response)
	});

}



