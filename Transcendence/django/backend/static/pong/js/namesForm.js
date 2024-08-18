import { Tournament } from './tournament.js';
import { views } from "../../main/js/main.js";


views.setElement('/tournament/local/', (state) => {
    document.getElementById('tournamentBody').style.display = state;
	loadNamesForm();
})
.setEvents(
);

function loadNamesForm() {
	const submitNames = document.getElementById("submitNames");
	submitNames.addEventListener('click', function() {
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
		const tournament =  new Tournament(number, names); // Using Singleton pattern
    });
}
