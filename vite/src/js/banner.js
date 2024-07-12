export class Banner {
	constructor (imgPath, playerName) {
		this.img = new Image();
		this.img.src = imgPath;
		this.playerName = playerName;
	}

	createBanner() {
		const bannerContainer = document.getElementById('banner');
		const h3 = document.createElement('h3');
		h3.classList.add('centered-text');
		h3.textContent = this.playerName;
		bannerContainer.appendChild(h3);
		bannerContainer.appendChild(this.img);
	}
}