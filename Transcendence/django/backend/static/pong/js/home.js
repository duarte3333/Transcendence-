import {views} from "../../main/js/main.js"
// import { highlightButtonNavbar } from "./navbar.js";
// import {secureElement} from "../../main/js/main.js"	

function highlightButtonNavbar(page) {
	const lastPageElements = document.getElementsByClassName("active");

	//needs to be converted to an array so it can use forEach
    if (lastPageElements.length > 0) {
		Array.from(lastPageElements).forEach(page => page.className = "nav-link");
    } else {
        console.log("No active page found.");
    }
	if (page == "home")
		document.getElementById("homeButton").className = "nav-link active";
	else if (page == "settings")
		document.getElementById("settingsButton").className = "nav-link active";
	else if (page == "profile")
		document.getElementById("profileButton").className = "nav-link active";
}



views.setElement("/home/", (state) => {
	//caso de merda a visualizar mudar block para flex
	views.get("/navbar/").display(state);
	document.getElementById("homeBody").style.display = state;
	highlightButtonNavbar("home");
})
.setEvents(
	[ "playOnline", "click",  (event) => nextPage(event, "playOnline") ],
	[ "playLocal", "click",  (event) => nextPage(event, "playLocal") ],
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
	rowButtons.appendChild(match);

	const tournament = document.createElement('button');
	tournament.className = "btn btn-outline-dark w-25 bodyBtns";
	tournament.id = "button_2";
	tournament.type = "button";
	tournament.textContent = "Tournament";
	tournament.addEventListener('click', () => {
		// tournamentStart(div, type);
	});
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
<<<<<<< HEAD
=======

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

function playOnlineMatch(event, type) {
	const container = event.target.closest('.container');
	if (!container) return;
	container.innerHTML = `<div class="row justify-content-center align-items-center" style="margin-bottom: 7rem; margin-top: 3rem;">
	<h5 class="display-1 text-center" style="font-size:3.5rem">Searching for an opponent...</h5>
	</div>
	<div class="row justify-content-center align-items-center">
		<div class="spinner-border text-primary" role="status"></div>
	</div>`;

	//request match to backend aqui
}
>>>>>>> 007bd64a2c7e5c302ca0d34f92cb366c40c1f8f6
