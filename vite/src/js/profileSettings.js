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
})

//add a reset page so you can't change several properties at the same time
function changeText(event, type) {
	console.log("entrou");
	
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
	input.type = 'text';
	input.id = "inputChange";
	input.className = 'form-control';
	input.placeholder = 'Username';
	input.setAttribute('aria-label', 'Username');
	input.setAttribute('aria-describedby', 'basic-addon1');

	//add finish button;
	let completeButton = document.createElement('button');
	completeButton.id = "completeChange";
	completeButton.className = "btn btn-dark rounded-circle p-2 lh-1 changeButton";
	completeButton.type = "button";
	completeButton.innerHTML = `
			<svg class="bi" width="16" height="16">
				<image class="changeImg" width="16" height="16" xlink:href="../img/tick.png"></image>
			</svg>
	`;
	completeButton.addEventListener('click', () => {
		completeChangeUser(oldParent, div, type);
	});

	div.appendChild(input);
	col.appendChild(div);
	col.appendChild(completeButton);
}

function completeChangeUser(oldParent, div, type) {
	const input = document.getElementById('inputChange');
	//checks input
	
	//update info latter on db
	if (type != "password") {
		const info = document.getElementById(type);
		if (info) {
			info.textContent = input.value;
		}
	}

	//returns to original page THIS WILL CHANGE WITH SPA
	//show old elements hide new ones
	oldParent.style.setProperty('display', 'flex', 'important');
	div.remove();
	const button = document.getElementById('completeChange');
	button.remove();
}