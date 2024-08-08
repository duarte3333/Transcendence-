let user = {
    username: "teo123",
    displayName: "Teo",
    profilePicture: "../img/p1.png",
    banner: "../img/banner.jpeg",
    wins: 12,
    losses: 7
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

	// const bannerContainer = document.getElementById('header');
	// bannerContainer.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');
	// bannerContainer.style.padding = "35px";
	// bannerContainer.style.borderRadius = "10px";
	// bannerContainer.style.border = "3px solid #000000";
	// bannerContainer.style.backgroundImage = `url(${user.banner})`;
	// bannerContainer.style.backgroundSize = "cover";
	// bannerContainer.style.backgroundPosition = "center";
	// bannerContainer.style.backgroundRepeat = "no-repeat";
	// bannerContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.5)"; // Adds depth

	// const profilePhoto = new Image();
	// profilePhoto.src = `${user.profilePicture}`; // Path to the player's profile photo
	// profilePhoto.alt = 'Player Profile';
	// profilePhoto.style.width = "100px"; // Set the width as needed
	// profilePhoto.style.height = "100px"; // Set the height as needed
	// profilePhoto.style.borderRadius = "50%"; // Circular photo
	// //profilePhoto.style.border = "2px solid white";
	// profilePhoto.style.border = "3px solid #0000ff"; // Bright green border
	// profilePhoto.style.boxShadow = "0 0 10px #0000ff"; // Blue glow effect
	// profilePhoto.style.marginBottom = "20px";

	// const nameText = document.createElement('h3');
	// nameText.textContent = user.displayName;
	// nameText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
	// nameText.style.color = "white";
	// nameText.style.padding = "10px 20px";
	// nameText.style.borderRadius = "10px";
	// nameText.style.textShadow = "2px 2px 2px #000000"; // Text shadow for readability
	// nameText.style.marginBottom = "10px"; // space between name and nickname


	// // const nicknameText = document.createElement('h4');
	// // nicknameText.textContent = this.playerNickname;
	// // nicknameText.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
	// // nicknameText.style.color = "white";
	// // //nicknameText.style.textShadow = "1px 1px 2px #000000";
	// // nicknameText.style.padding = "8px 16px";
	// // nicknameText.style.borderRadius = "10px";
	// // nicknameText.style.textShadow = "1px 1px 5px #0000ff"; // Blue glow effect
	// // nicknameText.style.fontSize = "0.8rem"; // Smaller text size for nickname

	// const statsText = document.createElement('p');
	// statsText.textContent = `Wins: ${user.wins},\n Losses: ${user.losses}`;
	// statsText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
	// statsText.style.color = "white";
	// statsText.style.padding = "5px 10px";
	// statsText.style.borderRadius = "10px";
	// statsText.style.fontSize = "0.8rem";

	// bannerContainer.appendChild(profilePhoto);
	// bannerContainer.appendChild(nameText);
	// bannerContainer.appendChild(statsText);

});