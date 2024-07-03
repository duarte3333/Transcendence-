const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

const candyImage = new Image();
candyImage.src = '../img/coin_gold.png';
// Handle image load error
candyImage.onerror = function() {
  console.error("Failed to load the image.");
};

class Candy {
  constructor(canvasWidth, canvasHeight, padding) {
    this.width = 32;
    this.height = 32;
    this.animationX = 32;
    this.animationY = 0;
    this.animationFrame = 0;
    this.animationNrFrames = 8;
    setInterval(() => {
      this.animationFrame++;
      if (this.animationFrame > this.animationNrFrames - 1)
        this.animationFrame = 0;
    }, 45);
    this.padding = padding;
    this.x = Math.random() * (canvasWidth - 2 * 50) + 50;
    this.y = Math.random() * (canvasHeight - 2 * 50) + 50;
    this.visible = true; // Visibility controlled for spawn timing
    this.name = "candy";
  }

  reset(canvasWidth, canvasHeight, player_1, player_2) {
    // Random position not too close to the walls
    this.x = Math.random() * (canvasWidth - 2 * this.padding) + this.padding;
    this.y = Math.random() * (canvasHeight - 2 * this.padding) + this.padding;
     setTimeout(() => {
         this.visible = true;
         player_1.height = 100;
         player_2.height = 100;
         console.log("Candy is now visible again");
        }, 5000);
  }
  
  draw(context) {
    if (this.visible) {
      if (candyImage.complete && candyImage.naturalHeight !== 0) {
        context.drawImage(candyImage, this.animationFrame * this.animationX, this.animationY, this.width, this.height, this.x, this.y, this.width, this.height);
      } else {
        console.error("Candy image is not fully loaded.");
      }
    }
  }
}

export { Candy };
