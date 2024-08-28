import { views } from "../../main/js/main.js";
import { addFriend } from "./user.js";
import { getUserFriends } from "./user.js";
import { deleteCookie, getCookie } from "./auxFts.js";

let friends;

views.setElement("/navbar", (state) => {

	// document.getElementById("navbarBody").style.display = state;
	if (state == "block") {
		document.getElementById('menuClose').click();
		highlightButtonNavbar();
		const label = document.getElementById("friendsLabel");
		label.innerText = `${window.user.display_name}'s Friends`;		
	}
})
.setEvents(
	[ "settingsButton", "click", () => views.urlLoad("/settings")],
	[ "logoutButton", "click", () => logout()],
	[ "profileButton", "click", () => views.urlLoad(`/profile?display_name=${window.user.display_name}`)],
	[ "homeButton", "click", () => views.urlLoad("/home")],
	[ "friendsButton", "click", () => generateFriendsList()],
	[ "addFriendFinal", "click", () => addFriendInputCheck()],
	[ "addFriend", "click", () => {
		const addFriendInputField = document.getElementById("validationServer01");
        addFriendInputField.value = ''; // Clear the input field
        const notFound = document.getElementById("notFound");
        const alreadyFriend = document.getElementById("alreadyFriend");
        notFound.style.display = "none";
        alreadyFriend.style.display = "none";
	}],
);

async function generateFriendsList() {
	friends = await getUserFriends();
	let friendsList = document.getElementById("friendsList");
	if (!friendsList) {
		friendsList = document.createElement('div');
		friendsList.id = "friendsList";
		document.getElementById("friendsDropdown").appendChild(friendsList);
	} else {
		friendsList.innerHTML = '';
	}


	// console.log("friends ==>>>", friends)
	if (friends.length === 0) {
		let li = document.createElement('li');
		let div = document.createElement('div');
		div.className = "dropdown-item lightGreyText d-flex align-items-center justify-content-between gap-2";
		div.innerText = "No friends added yet :(";
		li.appendChild(div);
		friendsList.appendChild(li);
		return ;
	}

	friends.forEach(user => {
		let li = document.createElement('li');

		let div = document.createElement('div');
		div.className = "dropdown-item lightGreyText d-flex align-items-center justify-content-between gap-2";

		let span = document.createElement('span');
		span.className = "text-start";
		span.innerText = user.display_name;

		let profileButton = document.createElement('button');
		profileButton.style.padding = "0px";
		profileButton.className = "btn d-flex align-items-center";
		profileButton.innerHTML = `
			<image height="16" width="16" src="/static/pong/img/account.png" style="filter: invert(1);"></image>
		`;
		profileButton.addEventListener('click', () => {views.urlLoad(`/profile?display_name=${user.display_name}`)});

		let chatButton = document.createElement('button');
		chatButton.className = "btn d-flex align-items-center";
		chatButton.style.padding = "0px";
		chatButton.innerHTML = `
			<image height="16" width="16" src="/static/pong/img/chat.png" style="filter: invert(1);"></image>
		`;
		chatButton.addEventListener('click', async () => {
			document.getElementById('menuClose').click();
			await window.chat.clickPlayerChatById(user.id);
		})

		let onlineStatus = document.createElement('img');
		onlineStatus.className = "image-end";
		onlineStatus.setAttribute('height', '14');
		onlineStatus.setAttribute('width', '14');
		if (user.online == true)
			onlineStatus.setAttribute('src', `/static/pong/img/online.png`);
		else
			onlineStatus.setAttribute('src', `/static/pong/img/offline.png`);

		div.appendChild(span);
		div.appendChild(profileButton);
		div.appendChild(chatButton);
		div.appendChild(onlineStatus);
		li.appendChild(div);
		friendsList.appendChild(li);
	});

}

async function addFriendInputCheck() {
    const addFriendInput = document.getElementById("validationServer01");
    const username = addFriendInput.value;

    // Hide previous messages
    const notFound = document.getElementById("notFound");
    const alreadyFriend = document.getElementById("alreadyFriend");
    notFound.style.display = "none";
    alreadyFriend.style.display = "none";

    // Make the API call
    const data = await addFriend(username);

    // Log the response for debugging
    // console.log("Response data:", data);

    if (data && data.message) {
        // Check the message or other properties in the response data to decide what to do
        if (data.message.includes('does not exist')) {
            notFound.style.display = "block";
        } else if (data.message.includes('already a friend')) {
            alreadyFriend.style.display = "block";
        } else {
            // Hide the modal if there is no error
            const myModalElement = document.getElementById('addFriendModal');
            const myModal = bootstrap.Modal.getInstance(myModalElement) || new bootstrap.Modal(myModalElement);
            myModal.hide();
        }
    } else {
        console.error('Unexpected response format:', data);
    }
}
// document.body.insertBe	fore(document.getElementById("navbarBody").parentElement, document.body.firstChild);

// document.body.insertBefore(document.getElementById("navbarBody").parentElement, document.body.firstChild);


function highlightButtonNavbar() {
	const lastPageElements = document.getElementsByClassName("active");
	
	const page = window.location.pathname;
	
	//needs to be converted to an array so it can use forEach
    if (lastPageElements.length > 0) {
		Array.from(lastPageElements).forEach(page => page.className = "nav-link");
    } else {
		console.log("No active page found.");
    }
	if (page == "/home") {
		document.getElementById("homeButton").className = "nav-link active";
	}
	else if (page == "/settings")
	document.getElementById("settingsButton").className = "nav-link active";
	else if (page == "/profile")
	document.getElementById("profileButton").className = "nav-link active";
}

function logout() {
	fetch('api/logout', {
        method: 'POST', // Use POST for logout requests
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Add CSRF token if needed
        },
        credentials: 'include' // Send cookies with the request
    })
    .then(response => {
        if (response.ok) {
            // Redirect or perform any action after successful logout
			window.user = undefined;
			views.urlLoad('/');
        } else {
            // Handle errors here
            console.error('Logout failed.');
        }
    })
    .catch(error => console.error('Error:', error));


    // deleteCookie('csrftoken');
    // deleteCookie('sessionid');
	// views.urlLoad('/');
}
