import { Animation } from "./animation";

const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

const candyImage = new Image();
candyImage.src = '../img/ItemBoxSprite.png';
// Handle image load error
candyImage.onerror = function() {
  console.error("Failed to load the image.");
};

class Candy {
  constructor(map) {
    this.powerUps = new Map();
    this.numPowerUps = 1;
    this.powerUps.set(1, defencePowerUp);
    this.animation = new Animation(16, 64, 64);
    this.width = 64;
    this.height = 64;
    const {x, y} = generateXnY(map);
    this.x = x;
    this.y = y;
    this.visible = false;
    setTimeout(() => {
      this.visible = true;
    }, 3000);
    this.name = "candy";
  }

  reset() {
    // Random position not too close to the walls
     setTimeout(() => {
          this.visible = true;
        }, 5000);
  }
  
  draw(context) {
    if (this.visible) {
      if (candyImage.complete && candyImage.naturalHeight !== 0) {
        context.drawImage(candyImage, this.animation.frame * this.animation.x, this.animation.y, this.width, this.height, this.x, this.y, this.width, this.height);
      } else {
        console.error("Candy image is not fully loaded.");
      }
    }
  }

  amIHit(ball) {
    // Find the closest point on the candy to the ball's center
    const closestX = Math.max(this.x, Math.min(ball.x, this.x + this.width));
    const closestY = Math.max(this.y, Math.min(ball.y, this.y + this.height));

     // Calculate the distance between the ball's center and this closest point
     const dx = ball.x - closestX;
     const dy = ball.y - closestY;
     const distance = Math.sqrt(dx * dx + dy * dy);

     // Check if the distance is less than or equal to the ball's radius
    return distance <= ball.radius;
  }

  choosePowerUp(player) {
    let num = Math.floor(Math.random() * this.numPowerUps + 1);
    const powerUP = this.powerUps.get(num);
    if (powerUP)
      powerUP(player);
  }
}

function generateXnY(map) {
  // Generate a random angle between 0 and 2π
  const angle = Math.random() * 2 * Math.PI;
  
  // Generate a random radius with uniform distribution
  const r = Math.sqrt(Math.random()) * (map.radius  / 1.4);
  
  // Convert polar coordinates to Cartesian coordinates
  const x = r * Math.cos(angle) + (canvas.width / 2);
  const y = r * Math.sin(angle) + (canvas.height / 2);
  
  return { x, y };
}

export { Candy };

export function checkCandies(ball, game) {
  let map = game.objects.get("map");
  for (let i = 1; i <= game.numCandies; i++) {
    let temp = game.objects.get("candy_" + i);
    if (temp.visible && temp.amIHit(ball) && ball.last_hit) {
      let player = game.objects.get(ball.last_hit);
      temp.visible = false;
      temp.choosePowerUp(player);
      const {x, y} = generateXnY(map);
      temp.x = x;
      temp.y = y;
      temp.reset();
    }
  }
}

function defencePowerUp(player) {
  console.log("defense for " + player.name);
  player.height *= 2;
  player.color = "blue";
  player.updateRectMap();
  setTimeout(() => {
    player.height /= 2;
    player.color = "black";
    player.updateRectMap();
  }, 8000);
}