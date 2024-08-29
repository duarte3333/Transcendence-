import { Tournament } from './tournament.js';
import { views } from "../../main/js/main.js";
import { Match } from './match.js';

let match;
let tournament;
let submitEvent;

views.setElement('/namesForm', (state) => {
	document.getElementById('tournamentBody').style.display = state;
	if (state == 'block') {
		document.getElementById('nameForm').style.display = 'block';
		loadNamesForm();
	} else {
		unloadNamesForm();
		if (match)
			match.destroyGame();
	}
 	views.get("/navbar").display(state);
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
	console.log("EVENT LIST => ", submitNames.event);
	submitEvent = async function() {
		var names = [];
        var number = document.getElementById('numberOfPlayers').value;
        for (var i = 0; i < number; i++) {
			    names.push(document.getElementById(`player${i + 1}`).value);
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
			tournament = undefined;
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
}