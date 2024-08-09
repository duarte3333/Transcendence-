document.addEventListener('DOMContentLoaded', function() {
	const username = document.getElementById("changeUsername");
	username.addEventListener('click', (event) => {
		changeText(event, "username");
	});

	const displayName = document.getElementById("changeDisplayName");
	displayName.addEventListener('click', (event) => {
		changeText(event, "displayName");
	});

	const password = document.getElementById("changePassword");
	password.addEventListener('click', (event) => {
		changeText(event, "password");
	});

	const profilePicture = document.getElementById("changeProfilePicture");
	profilePicture.addEventListener('click', (event) => {
		changeImage(event, "profilePicture");
	});

	const profileBanner = document.getElementById("changeBanner");
	profileBanner.addEventListener('click', (event) => {
		changeImage(event, "profileBanner");
	});

	const upKey = document.getElementById("changeUpKey");
	upKey.addEventListener('click', (event) => {
		changeText(event, "upKey");
	});

	const downKey = document.getElementById("changeDownKey");
	downKey.addEventListener('click', (event) => {
		changeText(event, "downKey");
	});
})

//add a reset page so you can't change several properties at the same time
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
				<image class="changeImg" width="16" height="16" xlink:href="../img/tick.png"></image>
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
		console.log(`info = ${info}, type = ${type}`);
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
				<image class="changeImg" width="16" height="16" xlink:href="../img/tick.png"></image>
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