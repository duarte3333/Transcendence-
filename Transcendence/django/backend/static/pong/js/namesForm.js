import { Tournament } from './tournament.js';

document.addEventListener('DOMContentLoaded', function() {
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

})
