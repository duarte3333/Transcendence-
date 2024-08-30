import { Tournament } from './tournament.js';
import { views } from "../../main/js/main.js";
import { Match } from './match.js';

let match = undefined;
let tournament = undefined;
let submitEvent = undefined;

views.setElement('/namesForm', (state) => {
	document.getElementById('tournamentBody').style.display = state;
	if (state == 'block') {
		document.getElementById('nameForm').style.display = 'block';
		loadNamesForm();
	} else {
		unloadNamesForm();
		console.log("UNLOAD NAMES FORM")
		if (match != undefined) {
			console.log("DESTROYING GAME")
			match.destroyGame();
			match = undefined;
		}
		if (tournament) {
			tournament.destroyTournament();
			tournament = undefined
		}
		// const button1 = document.getElementById('profileButtonChat');
		// if (button1)
		// 	button1.style.display = 'block';
		// const button2 = document.getElementById('inviteButtonChat');
		// if (button2)
		// 	button2.style.display = 'block';
	}
 	views.get("/navbar").display(state);
 	views.get("/chat").display(state);
	views.get("/footer").display(state);
})
.setChilds(["/navbar", "/footer", "/chat"])
.setEvents(
	["nb_button", "click", generateInputFields],
);

// views.setElement('/game', (state) => {
//     document.getElementById('tournamentBody').style.display = state;
// 	loadNamesForm();
// })
// .setChilds(["/navbar", "/footer"])
// .setEvents(
// 	["nb_button", "click", generateInputFields],
// );

function generateInputFields() {
	var number = document.getElementById('numberOfPlayers').value;
	if (number < 2) {
		alert('number has to be bigger that 2');
		return ;
	}
	var container = document.getElementById('inputContainer');
	container.innerHTML = ''; // Clear previous inputs

	for (var i = 0; i < number; i++) {
		var input = document.createElement('div');
		input.className = 'form-group display-1';
		input.style.fontSize = '1.2rem';
		input.style.margin = '0.5rem';
		input.innerHTML = `<label for="player${i + 1}">Player ${i + 1} Name</label><input type="text" id="player${i + 1}" name="player${i + 1}" class="form-control">`;
		container.appendChild(input);
	}
}

function loadNamesForm() {
	const submitNames = document.getElementById("submitNames");
	submitEvent = async function() {
		var names = [];
        var number = document.getElementById('numberOfPlayers').value;
		if (number < 2) {
			alert('number has to be bigger that 2');
			return ;
		}
        for (var i = 0; i < number; i++) {
			let newName;
			newName = document.getElementById(`player${i + 1}`).value;
			newName = newName.split(' ')[0];
			if (!newName) {
				alert('name cant be empty you sweatheart');
				return ;
			}	
			names.push(newName);	
		}
		var unique = names.filter((v, i, a) => a.indexOf(v) === i);
		if (unique.length !== names.length) {
			alert("Please enter unique names.");
			return ;
		}
		document.getElementById('nameForm').style.display = 'none';
		document.getElementById('gameForm').style.display = 'block';
		
		if (views.props.tournament == "true" && tournament == undefined) {
			tournament =  new Tournament(number, names); // Using Singleton pattern
		}
		else {
			if (match == undefined)
            	match = new Match("local", "normal", number, names, player1);
			await match.startLocalMatch();
			match = undefined;
            views.urlLoad("/home");
		}
    }

	submitNames.addEventListener('click', submitEvent);
}

function unloadNamesForm() {
	const submitNames = document.getElementById("submitNames");
	submitNames.removeEventListener('click', submitEvent);

	const gameForm = document.getElementById("gameForm");
	gameForm.style.display = 'none';

	const leaderboardDiv = document.getElementById("leaderboardDiv");
	if (leaderboardDiv)
		leaderboardDiv.remove();
}