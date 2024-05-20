const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

const candyImage = new Image();
candyImage.src = '../img/pastel4.png';
// Handle image load error
candyImage.onerror = function() {
  console.error("Failed to load the image.");
};

class Candy {
  constructor(canvasWidth, canvasHeight, padding) {
    this.width = 40;
    this.height = 29;
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
        context.drawImage(candyImage, this.x, this.y, this.width, this.height);
      } else {
        console.error("Candy image is not fully loaded.");
      }
    }
  }
}

export { Candy };
