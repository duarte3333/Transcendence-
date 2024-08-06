let users = [
    { username: "Antonio", status: "online" },
    { username: "Vasco", status: "offline" },
    { username: "Nuno", status: "online" },
    { username: "Joao", status: "offline" },
    { username: "Maria", status: "offline" }
];

let friends = [
    { username: "Antonio", status: "online" },
    { username: "Vasco", status: "offline" },
    { username: "Joao", status: "offline" }
];


document.addEventListener('DOMContentLoaded', function() {
	const friendsButton = document.getElementById("friendsButton");
	friendsButton.addEventListener('click', generateFriendsList);

	const addFriendInput = document.getElementById("addFriendFinal");
	addFriendInput.addEventListener('click', addFriendInputCheck);

	
    const addFriend = document.getElementById('addFriend');
    addFriend.addEventListener('click', function() {
        const addFriendInputField = document.getElementById("validationServer01");
        addFriendInputField.value = ''; // Clear the input field
        const notFound = document.getElementById("notFound");
        const alreadyFriend = document.getElementById("alreadyFriend");
        notFound.style.display = "none";
        alreadyFriend.style.display = "none";
    });
});


function generateFriendsList(event) {


	let friendsList = document.getElementById("friendsList");
	if (!friendsList) {
		friendsList = document.createElement('div');
		friendsList.id = "friendsList";
		document.getElementById("friendsDropdown").appendChild(friendsList);
	} else {
		friendsList.innerHTML = '';
	}

	friends.forEach(user => {
		let li = document.createElement('li');

		let div = document.createElement('div');
		div.className = "dropdown-item lightGreyText d-flex align-items-center justify-content-between";

		let span = document.createElement('span');
		span.className = "text-start";
		span.innerText = user.username;

		let chatButton = document.createElement('button');
		chatButton.className = "btn d-flex align-items-center";
		chatButton.innerHTML = `
			<image height="16" width="16" src="./img/chat.png" style="filter: invert(1);"></image>
		`;

		let onlineStatus = document.createElement('img');
		onlineStatus.className = "image-end";
		onlineStatus.setAttribute('height', '14');
		onlineStatus.setAttribute('width', '14');
		onlineStatus.setAttribute('src', `./img/${user.status}.png`);

		div.appendChild(span);
		div.appendChild(chatButton);
		div.appendChild(onlineStatus);
		li.appendChild(div);
		friendsList.appendChild(li);
	});

}

function addFriendInputCheck() {
	const addFriendInput = document.getElementById("validationServer01");
	const username = addFriendInput.value;

	const userObject = users.find(user => user.username === username);

	notFound.style.display = "none";
	alreadyFriend.style.display = "none";

	if (!userObject) {
		let notFound = document.getElementById("notFound");
		notFound.style.display = "block";
	} else if (friends.find(user => user.username === username)) {
		let alreadyFriend = document.getElementById("alreadyFriend");
		alreadyFriend.style.display = "block";
	} else {
		//ADD FRIEND
		friends.push(userObject);
		
		const myModalElement = document.getElementById('addFriendModal');
		const myModal = bootstrap.Modal.getInstance(myModalElement) || new bootstrap.Modal(myModalElement);
		myModal.hide();
	}
}

// function addFriend() {
// 	let modal = document.getElementById("addFriendModal");
// 	modal.style.display = "flex";
// }