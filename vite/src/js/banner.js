export class Banner {
	constructor (imgPath, playerName) {
		this.img = new Image();
		this.img.src = imgPath;
		this.playerName = playerName;
	}

	createBanner() {
		const bannerContainer = document.getElementById('banner');
		bannerContainer.classList.add('d-flex');
		bannerContainer.classList.add('justify-content-center');
		bannerContainer.classList.add('align-items-start');
		bannerContainer.style.paddingTop = "2%";
		bannerContainer.style.borderRadius = "10px";
		bannerContainer.style.border = "3px solid #000000";
		const h3 = document.createElement('h3');
		h3.classList.add('centered-text');
		h3.textContent = this.playerName;
		h3.style.display = "inline-block";
		h3.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
		h3.style.color = "white";
		h3.style.padding = "10px 20px";
		h3.style.borderRadius = "10px";
		bannerContainer.appendChild(h3);
		bannerContainer.style.backgroundImage = `url(${this.img.src})`;
		bannerContainer.style.backgroundSize = "cover";
		bannerContainer.style.backgroundPosition = "center";
		bannerContainer.style.backgroundRepeat = "no-repeat";
	}
}