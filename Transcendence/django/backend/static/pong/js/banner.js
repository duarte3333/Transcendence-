export class Banner {
    constructor(imgPath, playerName, playerNickname, playerStats) {
        this.img = new Image();
        this.img.src = imgPath;
		this.imgProfile = new Image();
		this.imgProfile.src = "/static/pong/img/p1.png";
        this.playerName = playerName;
        this.playerNickname = playerNickname;
        this.playerStats = playerStats;

        this.profilePhoto;
        this.nameText;
        // this.nicknameText;
        this.statsText;
    }

    createBanner() {
        let user = window.user;

        const bannerContainer = document.getElementById('banner');

        if (bannerContainer.innerHTML != '')
            return ;

        bannerContainer.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');
        bannerContainer.style.padding = "20px";
        bannerContainer.style.borderRadius = "10px";
        bannerContainer.style.border = "3px solid #000000";
        bannerContainer.style.backgroundImage = `url(${user.banner_picture})`;
        bannerContainer.style.backgroundSize = "cover";
        bannerContainer.style.backgroundPosition = "center";
        bannerContainer.style.backgroundRepeat = "no-repeat";
        bannerContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.5)"; // Adds depth

        const profilePhoto = new Image();
        profilePhoto.src = user.profile_picture; // Path to the player's profile photo
        profilePhoto.alt = 'Player Profile';
        profilePhoto.style.width = "100px"; // Set the width as needed
        profilePhoto.style.height = "100px"; // Set the height as needed
        profilePhoto.style.borderRadius = "50%"; // Circular photo
        //profilePhoto.style.border = "2px solid white";
		profilePhoto.style.border = "3px solid #0000ff"; // Bright green border
        profilePhoto.style.boxShadow = "0 0 10px #0000ff"; // Blue glow effect
        profilePhoto.style.marginBottom = "10px";
        profilePhoto.style.objectFit = "cover";

        const nameText = document.createElement('h3');
        nameText.textContent = user.display_name;
        nameText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        nameText.style.color = "white";
        nameText.style.padding = "10px 20px";
        nameText.style.borderRadius = "10px";
		nameText.style.textShadow = "2px 2px 2px #000000"; // Text shadow for readability
        nameText.style.marginBottom = "5px"; // space between name and nickname


        // const nicknameText = document.createElement('h4');
        // nicknameText.textContent = this.playerNickname;
        // nicknameText.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        // nicknameText.style.color = "white";
		// //nicknameText.style.textShadow = "1px 1px 2px #000000";
        // nicknameText.style.padding = "8px 16px";
        // nicknameText.style.borderRadius = "10px";
        // nicknameText.style.textShadow = "1px 1px 5px #0000ff"; // Blue glow effect
        // nicknameText.style.fontSize = "0.8rem"; // Smaller text size for nickname

        const statsText = document.createElement('p');
        statsText.textContent = `Wins: ${user.wins || 0}  Losses: ${user.losses || 0}`;
        statsText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        statsText.style.color = "white";
        statsText.style.padding = "5px 10px";
        statsText.style.borderRadius = "10px";
        statsText.style.fontSize = "0.8rem";

        this.profilePhoto = profilePhoto;
        this.nameText = nameText;
        // this.nicknameText = nicknameText;
        this.statsText = statsText;

        bannerContainer.appendChild(profilePhoto);
        bannerContainer.appendChild(nameText);
        // bannerContainer.appendChild(nicknameText);
        bannerContainer.appendChild(statsText);
    }

    clearBanner()
    {
        const bannerContainer = document.getElementById('banner');
        bannerContainer.removeChild(this.profilePhoto);
        bannerContainer.removeChild(this.nameText);
        bannerContainer.removeChild(this.nicknameText);
        bannerContainer.removeChild(this.statsText);
    }
}
