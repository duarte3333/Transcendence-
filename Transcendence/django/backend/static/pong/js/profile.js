import {views} from "../../main/js/main.js"

let user = {
    username: "teo123",
    displayName: "Teo",
    profilePicture: "/static/pong/img/p1.png",
    banner: "/static/pong/img/banner.jpeg",
    wins: 12,
    losses: 7,
	matchHistory: {
		match_001: { type: "normal",  numPlayers: 2, players: ["Teo", "Antonio"], hostName: "Teo", id:"001", finalscore: {Teo:5, Antonio: 3}, date:[10, 8, 2024], winner:"Teo"},
		match_002: { type: "normal",  numPlayers: 3, players: ["Teo", "Antonio", "Joao"], hostName: "Joao", id:"002", finalscore: {Teo:4, Antonio: 1, Joao:5}, date:[9, 8, 2024], winner:"Joao"},
		match_003: { type: "tournament quarters",  numPlayers: 2, players: ["Teo", "Nuno"], hostName: "Teo", id:"003", finalscore: {Teo:3, Nuno: 5}, date:[7, 8, 2024], winner:"Nuno"},
		match_004: { type: "tournament final",  numPlayers: 2, players: ["Teo", "Duarte"], hostName: "Duarte", id:"004", finalscore: {Teo:5, Duarte: 4}, date:[7, 8, 2024], winner:"Teo"},
		match_005: { type: "normal",  numPlayers: 4, players: ["Teo", "Antonio", "Duarte", "Nuno"], hostName: "Nuno", id:"005", finalscore: {Teo:3, Antonio: -1, Duarte:5, Nuno:4}, date:[6, 8, 2024], winner:"Duarte"},
	}
};

views.setElement("/profile/", (state) => {
	//caso de merda a visualizar mudar block para flex
	views.get("/navbar/").display(state);
	document.getElementById("profileBody").style.display = state;

	loadProfile();
})
.setEvents(
	[ "matchHistoryButton", "click",  (event) => showMatchHistory(event)]
);

function loadProfile() {
	const header = document.getElementById("header");
	header.style.backgroundImage = `url(${user.banner})`;

	const profilePicture = document.getElementById("profilePicture");
	profilePicture.setAttribute('src', user.profilePicture);

	const displayName = document.getElementById("displayName");
	displayName.innerText = user.displayName;

	const winsRatio = document.getElementById("winsRatio");
	winsRatio.innerText = `Wins: ${user.wins}, Losses: ${user.losses}`;
}

function showMatchHistory(event){
	const matchHistory = document.getElementById("matchHistory");
	if (matchHistory.style.display == "block") {
		matchHistory.setAttribute("style", "display: none !important;");
	}
	else
		matchHistory.style.display = "block";

	let title;
	if (!document.getElementById("matchHistoryTitle")) {
		title = document.createElement('p');
		title.innerText = `${user.displayName}'s Match History`;
		title.id = "matchHistoryTitle"
		title.className = "h1";
		title.style.marginBottom = "2rem";
		matchHistory.appendChild(title);

		for (const matchId in user.matchHistory) {
			if (user.matchHistory.hasOwnProperty(matchId)) {
				const match = user.matchHistory[matchId];

				const row = document.createElement('div');
				row.className = "row row-matchHistory text-center";
				row.style.width = "100%";

				// TYPE AND DATE
				const col1 = document.createElement('div');
				col1.className = "col-3 d-flex justify-content-center gap-2 align-items-center"
				col1.style.flexDirection = "column"
				col1.style.paddingTop = "1rem";
				col1.style.paddingBottom = "1rem";

				const type = document.createElement('h5');
				type.innerText = `Type: ${match.type}`;
				col1.appendChild(type);

				const date = document.createElement('h5');
				date.innerText = `Date: ${match.date}`;
				col1.appendChild(date);

				row.appendChild(col1);

				//WINNER
				const col2 = document.createElement('div');
				col2.className = "col-6 d-flex justify-content-center gap-2 align-items-center"
				col2.style.paddingTop = "1rem";
				col2.style.paddingBottom = "1rem";

				const winner = document.createElement('h1');
				winner.innerText = `Winner: ${match.winner}`;
				col2.appendChild(winner);

				row.appendChild(col2);

				//PLAYERS
				const col3 = document.createElement('div');
				col3.className = "col-3 d-flex justify-content-center gap-2 align-items-center"
				col3.style.paddingTop = "1rem";
				col3.style.paddingBottom = "1rem";
				col3.style.flexDirection = "column"

				const playersTitle = document.createElement('h3');
				playersTitle.innerText = `Players:`;
				col3.appendChild(playersTitle);

				for (let i = 0; i < match.numPlayers; i++) {
					const player = document.createElement("h5");
					player.innerText = `${match.players[i]}: ${match.finalscore[match.players[i]]}`;
					col3.appendChild(player);
				}

				row.appendChild(col3);

				matchHistory.appendChild(row);
			}
		}
	}
}