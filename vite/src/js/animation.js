export class Animation {
	constructor(frames, sizeX, sizeY) {
	this.width = sizeX;
	this.height = sizeY;
	this.x = sizeX;
	this.y = 0;
	this.frame = 0;
	this.nrFrames = frames;
	setInterval(() => {
		this.frame++;
		if (this.frame > this.nrFrames - 1)
		this.frame = 0;
	}, 65);
	}
};
