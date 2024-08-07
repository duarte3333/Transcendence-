let user = {
    username: "teo123",
    displayName: "Teo",
    profilePicture: "/static/pong/img/p1.png",
    banner: "/static/pong/img/banner.jpeg",
    wins: 12,
    losses: 7,
	matchHistory: {
		match_001: { type: "normal",  numPlayers: 2, players: ["Teo", "Antonio"], hostName: "Teo", id:"001", finalscore: {Teo:5, Antonio: 3}, winner:"Teo"},
		match_002: { type: "normal",  numPlayers: 3, players: ["Teo", "Antonio", "Joao"], hostName: "Joao", id:"002", finalscore: {Teo:4, Antonio: 1, Joao:5}, winner:"Joao"},
		match_003: { type: "tournament quarters",  numPlayers: 2, players: ["Teo", "Nuno"], hostName: "Teo", id:"003", finalscore: {Teo:3, Antonio: 5}, winner:"Nuno"},
		match_004: { type: "tournament final",  numPlayers: 2, players: ["Teo", "Duatye"], hostName: "Duarte", id:"004", finalscore: {Teo:5, Duarte: 4}, winner:"Teo"},
		match_005: { type: "normal",  numPlayers: 4, players: ["Teo", "Antonio", "Duarte", "Nuno"], hostName: "Nuno", id:"005", finalscore: {Teo:3, Antonio: -1, Duarte:5, Nuno:4}, winner:"Duarte"},
	}
};


document.addEventListener('DOMContentLoaded', function() {
	const header = document.getElementById("header");
	header.style.backgroundImage = `url(${user.banner})`;

	const profilePicture = document.getElementById("profilePicture");
	profilePicture.setAttribute('src', user.profilePicture);

	const displayName = document.getElementById("displayName");
	displayName.innerText = user.displayName;

	const winsRatio = document.getElementById("winsRatio");
	winsRatio.innerText = `Wins: ${user.wins}, Losses: ${user.losses}`;

	const matchHistoryButton = document.getElementById("matchHistoryButton");
	matchHistoryButton.addEventListener('click', showMatchHistory());
});

function showMatchHistory(){
	const matchHistory = document.getElementById("matchHistory");
	matchHistory.style.display = "block";


}