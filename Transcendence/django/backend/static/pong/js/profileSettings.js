import {views} from "../../main/js/main.js"
// import {secureElement} from "../../main/js/main.js"	
// import {sleep} from "./auxFts.js"

let user = {
	id: 2,
    username: "teo123",
    displayName: "Teo",
    profilePicture: "/static/pong/img/p1.png",
    banner: "/static/pong/img/banner.jpeg",
    wins: 12,
    losses: 7,
	upKey: "w",
	downKey: "s",
	// matchHistory: {
	// 	match_001: { type: "normal",  numPlayers: 2, players: ["Teo", "Antonio"], hostName: "Teo", id:"001", finalscore: {Teo:5, Antonio: 3}, winner:"Teo"},
	// 	match_002: { type: "normal",  numPlayers: 3, players: ["Teo", "Antonio", "Joao"], hostName: "Joao", id:"002", finalscore: {Teo:4, Antonio: 1, Joao:5}, winner:"Joao"},
	// 	match_003: { type: "tournament quarters",  numPlayers: 2, players: ["Teo", "Nuno"], hostName: "Teo", id:"003", finalscore: {Teo:3, Antonio: 5}, winner:"Nuno"},
	// 	match_004: { type: "tournament final",  numPlayers: 2, players: ["Teo", "Duatye"], hostName: "Duarte", id:"004", finalscore: {Teo:5, Duarte: 4}, winner:"Teo"},
	// 	match_005: { type: "normal",  numPlayers: 4, players: ["Teo", "Antonio", "Duarte", "Nuno"], hostName: "Nuno", id:"005", finalscore: {Teo:3, Antonio: -1, Duarte:5, Nuno:4}, winner:"Duarte"},
	// }
};

views.setElement("/settings/", (state) => {
	//caso de merda a visualizar mudar block para flex
	views.get("/navbar/").display(state);
	document.getElementById("settingsContainer").style.display = state;
	loadProfileSettings();
	views.get("/footer/").display(state);
})
.setChilds(["/navbar/", "/footer/"])
.setEvents(
	[ "changeUsername", "click",  (event) => changeText(event, "username")],
	[ "changeDisplayName", "click",  (event) => changeText(event, "displayName")],
	[ "changePassword", "click",  (event) => changeText(event, "password")],
	[ "changeProfilePicture", "click",  (event) => changeImage(event, "profilePicture")],
	[ "changeBanner", "click",  (event) => changeImage(event, "profileBanner")],
	[ "changeUpKey", "click",  (event) => changeText(event, "upKey")],
	[ "changeDownKey", "click",  (event) => changeText(event, "downKey")]
);

function loadProfileSettings() {
	const username = document.getElementById("username");
	username.innerText = user.username;

	const displayName = document.getElementById("displayName");
	displayName.innerText = user.displayName;

	const upKey = document.getElementById("upKey");
	upKey.innerText = user.upKey;

	const downKey = document.getElementById("downKey");
	downKey.innerText = user.downKey;

	const profilePicture = document.getElementById("profilePicture");
	profilePicture.setAttribute("xlink:href", user.profilePicture);

	const banner = document.getElementById("profileBanner");
	banner.setAttribute("xlink:href", user.banner);
}
function changeText(event, type) {
	
	//hide old elements
	const oldParent = event.target.closest('.displayDiv');
    if (!oldParent) return;
	oldParent.style.setProperty('display', 'none', 'important');

	const col = event.target.closest('.col');
    if (!col) return;

	let div;
	div = document.createElement('div');
	div.id = "changeDiv";
	div.classList.add('input-group');
	div.classList.add('w-25');
	div.classList.add('gap-3');
	
	//add input for new user
	let input;
	input = document.createElement('input');
	if (type != "password")
		input.type = 'text';
	else
		input.type = 'password';
	input.id = type + "input";
	input.className = 'form-control';
	input.setAttribute('aria-label', type);
	input.setAttribute('aria-describedby', 'basic-addon1');
	if (type == "upKey" || type == "downKey") {
		input.readOnly = true;
		input.addEventListener('keydown', function keyHandler(event) {
            input.value = event.key;  // Capture the key
            document.removeEventListener('keydown', keyHandler);  // Remove the event listener after capturing the key
        });
	}

	//add finish button;
	let completeButton = document.createElement('button');
	completeButton.id = type + "button";
	completeButton.className = "btn btn-dark rounded-circle p-2 lh-1 changeButton";
	completeButton.type = "button";
	completeButton.innerHTML = `
			<svg class="bi" width="16" height="16">
				<image class="changeImg" width="16" height="16" xlink:href="/static/pong/img/tick.png"></image>
			</svg>
	`;
	completeButton.addEventListener('click', () => {
		completeChangeText(oldParent, div, type, input.id, completeButton.id);
	});

	div.appendChild(input);
	col.appendChild(div);
	col.appendChild(completeButton);
}

function completeChangeText(oldParent, div, type, inputID, buttonID) {
	const input = document.getElementById(inputID);
	//checks input
	
	//update info latter on db
	if (type != "password") {
		const info = document.getElementById(type);
		if (info) {
			info.textContent = input.value;
		}
	}

	//show old elements hide new ones
	oldParent.style.setProperty('display', 'flex', 'important');
	div.remove();
	const button = document.getElementById(buttonID);
	button.remove();
}

function changeImage(event, type) {
	//hide old elements
	const oldParent = event.target.closest('.displayDiv');
    if (!oldParent) return;
		oldParent.style.setProperty('display', 'none', 'important');
		
	const col = event.target.closest('.col');
	if (!col) return;

	let div;	
	div = document.createElement('div');
	div.id = "changeDiv";
	div.classList.add('input-group');
	div.classList.add('w-25');
	div.classList.add('gap-3');
	
	//add input for new user
	let input;
	input = document.createElement('input');
	input.type = 'file'
	input.id = type + "input";
	input.className = 'form-control';
	input.placeholder = 'Choose a file';
	input.setAttribute('aria-label', 'Small file input example');

	//add finish button;
	let completeButton = document.createElement('button');
	completeButton.id = type + "button";
	completeButton.className = "btn btn-dark rounded-circle p-2 lh-1 changeButton";
	completeButton.type = "button";
	completeButton.innerHTML = `
			<svg class="bi" width="16" height="16">
				<image class="changeImg" width="16" height="16" xlink:href="/static/pong/img/tick.png"></image>
			</svg>
	`;
	completeButton.addEventListener('click', () => {
		completeChangeImage(oldParent, div, type, input.id, completeButton.id);
	});

	div.appendChild(input);
	col.appendChild(div);
	col.appendChild(completeButton);
}

function completeChangeImage(oldParent, div, type, inputID, buttonID) {
	const fileInput = document.getElementById(inputID);
	if (!fileInput || fileInput.files.length === 0) {
		alert('Please select a file.');
		return;
	}

	const file = fileInput.files[0];

	// Perform the upload using fetch or another method WHEN BACKEND IS UP USE THIS
	// fetch('/upload', { // replace with your upload endpoint
	// 	method: 'POST',
	// 	body: formData
	// })
	// .then(response => response.json())
	// .then(data => {
	// 	// Handle successful upload here
	// 	console.log('File uploaded successfully:', data);

	// 	// Optionally update the UI to reflect the change
	// 	oldParent.style.removeProperty('display');
	// 	div.remove();
	// })

	//TRYING WITHOUT BACKEND
	const reader = new FileReader();
	reader.onload = function(event) {
		const imgElement = document.getElementById(type);
		if (imgElement) {
			imgElement.setAttribute('href', event.target.result);
		}
	};
	reader.readAsDataURL(file);

	//show old elements hide new ones
	oldParent.style.setProperty('display', 'flex', 'important');
	div.remove();
	const button = document.getElementById(buttonID);
	button.remove();
}

// views.load("/navbar/")
