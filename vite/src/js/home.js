export let theTournament = null;
document.addEventListener('DOMContentLoaded', function() {
	const playOnline = document.getElementById("playOnline");
	playOnline.addEventListener('click', (event) => {
		nextPage(event, "playOnline");
	});

	const playLocal = document.getElementById("playLocal");
	playLocal.addEventListener('click', (event) => {
		nextPage(event, "playLocal");
	});

})

function nextPage(event, type) {
	const oldParent = event.target.closest('.displayDiv');
    if (!oldParent) return;
	oldParent.style.setProperty('display', 'none', 'important');

	const container = event.target.closest('.container');
	if (!container) return;

	const div = document.createElement('div');
	div.id = type +  "div";

	const rowButtons = document.createElement('div');
	rowButtons.className = "row justify-content-center gap-3";
	rowButtons.style.marginBottom = "1.5rem";

	const match = document.createElement('button');
	match.className = "btn btn-outline-dark w-25 bodyBtns";
	match.type = "button";
	match.textContent = "Match";
	match.addEventListener('click', () => {
		//document.getElementById('homePage').style.display = 'none';
        //document.getElementById('nameForm').style.display = 'block';
	});

	const tournament = document.createElement('button');
	tournament.className = "btn btn-outline-dark w-25 bodyBtns";
	tournament.type = "button";
	tournament.textContent = "Tournament";	
	// tournament.addEventListener('click', () => {
	// 	document.getElementById('homePage').style.display = 'none';
	// 	if (type === "playLocal") {
    //     	document.getElementById('nameForm').style.display = 'block';
	// 	}
	// });

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
	rowButtons.appendChild(match);
	rowButtons.appendChild(tournament);
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