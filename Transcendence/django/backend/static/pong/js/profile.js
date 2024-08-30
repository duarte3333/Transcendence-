import {views} from "../../main/js/main.js"
import { getUser, getUserById } from "./user.js"
import { getCookie } from "./auxFts.js";

// let user = {
//     username: "teo123",
//     displayName: "Teo",
//     profilePicture: "/static/pong/img/p1.png",
//     banner: "/static/pong/img/banner.jpeg",
//     wins: 12,
//     losses: 7,
// 	matchHistory: {
// 		match_001: { type: "normal",  numPlayers: 2, players: ["Teo", "Antonio"], hostName: "Teo", id:"001", finalscore: {Teo:5, Antonio: 3}, date:[10, 8, 2024], winner:"Teo"},
// 		match_002: { type: "normal",  numPlayers: 3, players: ["Teo", "Antonio", "Joao"], hostName: "Joao", id:"002", finalscore: {Teo:4, Antonio: 1, Joao:5}, date:[9, 8, 2024], winner:"Joao"},
// 		match_003: { type: "tournament quarters",  numPlayers: 2, players: ["Teo", "Nuno"], hostName: "Teo", id:"003", finalscore: {Teo:3, Nuno: 5}, date:[7, 8, 2024], winner:"Nuno"},
// 		match_004: { type: "tournament final",  numPlayers: 2, players: ["Teo", "Duarte"], hostName: "Duarte", id:"004", finalscore: {Teo:5, Duarte: 4}, date:[7, 8, 2024], winner:"Teo"},
// 		match_005: { type: "normal",  numPlayers: 4, players: ["Teo", "Antonio", "Duarte", "Nuno"], hostName: "Nuno", id:"005", finalscore: {Teo:3, Antonio: -1, Duarte:5, Nuno:4}, date:[6, 8, 2024], winner:"Duarte"},
// 	}
// };

let user;
let userMatchHistory;

views.setElement("/profile", (state) => {
	//caso de merda a visualizar mudar block para flex
	// if (state != "block") return;
	// let user = await getUser();
	if (state == "block")
		loadProfile();
	views.get("/footer").display(state);
	views.get("/navbar").display(state);
	views.get("/chat").display(state);
	document.getElementById("profileBody").style.display = state;
})
.setChilds(["/navbar", "/footer", "/chat"])
.setEvents(
	[ "matchHistoryButton", "click",  (event) => showMatchHistory(event)]
	);
	
async function loadProfile() {
	const matchHistory = document.getElementById("matchHistory");
	matchHistory.innerHTML = ``;
	matchHistory.setAttribute("style", "display: none !important;");

	console.log("display =", views.props.display_name);
	user =  await getUser(views.props.display_name);
	if (user == undefined) {
		views.urlLoad("/home");
		return ;
	}
	userMatchHistory =  await getMatchHistory(user.id);
	userMatchHistory.sort((a, b) => b.id - a.id);

	// console.log("profile user = ", user);
	console.log("match history = ", userMatchHistory);

	const header = document.getElementById("header");
	header.style.backgroundImage = `url(${user.banner_picture})`;

	const profilePicture = document.getElementById("profilePicture");
	profilePicture.setAttribute('src', user.profile_picture);

	const displayName = document.getElementById("displayName");
	displayName.innerText = user.display_name;

	const winsRatio = document.getElementById("winsRatio");
	winsRatio.innerText = `Wins: ${user.wins || 0} Losses: ${user.losses || 0}`;
}

async function showMatchHistory(event){
	const matchHistory = document.getElementById("matchHistory");
	if (matchHistory.style.display == "block") {
		matchHistory.setAttribute("style", "display: none !important;");
	}
	else
		matchHistory.style.display = "block";

	let title;
	if (!document.getElementById("matchHistoryTitle")) {
		title = document.createElement('p');
		title.innerText = `${user.display_name}'s Match History`;
		title.id = "matchHistoryTitle"
		title.className = "h1";
		title.style.marginBottom = "2rem";
		matchHistory.appendChild(title);

		if (!userMatchHistory) {
			const row = document.createElement('div');
			row.className = "row row-matchHistory text-center";
			row.style.justifyContent = "center"
			row.style.padding = "10px"
			row.style.width = "100%";
			row.innerText = "No Matches...";
			matchHistory.appendChild(row);
			return ;
		}

		for (const matchId in userMatchHistory) {
			if (userMatchHistory.hasOwnProperty(matchId)) {
				const match = userMatchHistory[matchId];
				// console.log("got match =", match);

				const displayMap = new Map();
				for (let i = 0; i < match.numberPlayers; i++) {
					let userTemp =  await getUserById(match.player[i]);
					displayMap.set(userTemp.id, userTemp.display_name);
				}

				const row = document.createElement('div');
				row.className = "row row-matchHistory text-center";
				row.style.width = "100%";
				if ((displayMap.get(parseInt(match.winner)) != user.display_name && match.winner != "disconnect") ||
					(match.winner == "disconnect" && match.scoreList.find(item => parseInt(item.id) === user.id).score == 'disconnect'))
					row.style.backgroundColor = "rgba(255, 3, 3, 0.6)";
				else if (match.winner != "disconnect")
					row.style.backgroundColor = "rgba(36, 135, 0, 0.6)";

				// TYPE AND DATE
				const col1 = document.createElement('div');
				col1.className = "col-3 d-flex justify-content-center gap-2 align-items-center"
				col1.style.flexDirection = "column"
				col1.style.paddingTop = "1rem";
				col1.style.paddingBottom = "1rem";

				const type = document.createElement('h5');
				type.innerText = `Type: ${match.game_type}`;
				col1.appendChild(type);

				const date = document.createElement('h5');
				date.innerText = `Date: ${match.createDate}`;
				col1.appendChild(date);

				row.appendChild(col1);

				//WINNER
				const col2 = document.createElement('div');
				col2.className = "col-6 d-flex justify-content-center gap-2 align-items-center"
				col2.style.paddingTop = "1rem";
				col2.style.paddingBottom = "1rem";

				const winner = document.createElement('h1');
				if (displayMap.get(parseInt(match.winner)))
					winner.innerText = `Winner: ${displayMap.get(parseInt(match.winner))}`;
				else
					winner.innerText = `Disconnected`;
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

				for (let i = 0; i < match.numberPlayers; i++) {
					const player = document.createElement("h5");
					player.innerText = `${displayMap.get(match.player[i])}: ${match.scoreList.find(item => parseInt(item.id) === match.player[i]).score}`;
					col3.appendChild(player);
				}

				row.appendChild(col3);

				matchHistory.appendChild(row);
			}
		}
	}
}

async function getMatchHistory(id) {
	if (!id)
	id = window.user.id;
	const data = JSON.stringify({
		"status": "finished",
		"playerId": id
	});
	try {
	const response = await fetch(window.hostUrl + '/api/game/list', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken')
		},
		body: data,
	});
		const result = await response.json();
		if (!response.ok)
			console.error('Error on getMatchHistory: ', result.status);
		return result.game;
	} catch (error) {
		console.error('Request failed:', error);
	}
}