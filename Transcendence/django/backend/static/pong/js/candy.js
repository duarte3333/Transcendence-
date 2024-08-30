import { Animation } from "./animation.js";
import { views } from "../../main/js/main.js";


const candyImage = new Image();
candyImage.src = '/static/pong/img/ItemBoxSprite.png';
// Handle image load error
candyImage.onerror = function() {
  console.error("Failed to load the image.");
};

class Candy {
  constructor(map, name) {
    this.powerUps = new Map();
    this.numPowerUps = 3;
    this.powerUps.set(1, defencePowerUp);
    this.powerUps.set(2, attackPowerUp);
    this.powerUps.set(3, speedPowerUp);
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
    this.name = name;
  }

  reset(game) {
    // Random position not too close to the walls
     setTimeout(() => {
          this.visible = true;
          this.sendCandy(game);
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

  choosePowerUp(player, game) {
    let num = Math.floor(Math.random() * this.numPowerUps + 1);
    const powerUP = this.powerUps.get(num);
    if (powerUP) {
      powerUP(player, game);
      if (num == 1)
        sendPowerUp(game, player, "defence");
      else if (num == 2)
        sendPowerUp(game, player, "attack");
      else if (num == 3)
        sendPowerUp(game, player, "speed");
    }
  }

  sendCandy(game) {
    if (views.props.type != 'online')
      return ;
    // console.log("sending candy, ", this.visible);
    game.socket.send(JSON.stringify({
      'type': 'candy',
      'action': 'candy',
      'name': this.name,
      'x': this.x,
      'y': this.y,
      'visibility': this.visible,
  }))
  }
}

function generateXnY(map) {
  const canvas = document.getElementById("pongCanvas");
  // Generate a random angle between 0 and 2π
  const angle = Math.random() * 2 * Math.PI;
  
  // Generate a random radius with uniform distribution
  const r = Math.sqrt(Math.random()) * (map.radius  / 1.8);
  
  // Convert polar coordinates to Cartesian coordinates
  const x = r * Math.cos(angle) + (canvas.width / 2);
  const y = r * Math.sin(angle) + (canvas.height / 2);
  
  return { x, y };
}

export { Candy };

export function checkCandies(ball, game) {
  if (game.candies <= 0)
    return ;
  let map = game.objects.get("map");
  for (let i = 1; i <= game.numCandies; i++) {
    let temp = game.objects.get("candy_" + i);
    if (temp.visible && temp.amIHit(ball) && ball.last_hit) {
      let player = game.objects.get(ball.last_hit);
      temp.visible = false;
      temp.choosePowerUp(player, game);
      const {x, y} = generateXnY(map); 
      temp.x = x;
      temp.y = y;
      temp.reset(game);
    }
  }
}

export function defencePowerUp(player, game) {
  player.height *= 2;
  if (player.height > player.edge.size)
      player.height = player.edge.size;
  player.color = "blue";
  player.updateRectMap();
  setTimeout(() => {
    player.height /= 2;
    if (player.height < player.edge.size / 5)
      player.height = player.edge.size / 5;
    if (player.height == player.edge.size / 5)
      player.color = "black";
    player.updateRectMap();
  }, 8000);
}

export function attackPowerUp(player, game) {
  for (let i = 1; i <= game.numberOfPlayers; i++) {
    let temp = game.objects.get("paddle_" + i);
    if (temp.height >= temp.edge.size / 5 && temp.name != player.name) {
      temp.height /= 2;
      temp.color = "green";
      temp.updateRectMap();
    }
  }
  setTimeout(() => {
    for (let i = 1; i <= game.numberOfPlayers; i++) {
      let temp = game.objects.get("paddle_" + i);
      if (temp.name != player.name) {
        temp.height *= 2;
        temp.color = "black";
        temp.updateRectMap();
      }
    }
  }, 6000);
}

export function speedPowerUp(player, game) {
  player.speed *= 2;
  player.color = "#c1c100";
  setTimeout(() => {
    player.speed /= 2;
    player.color = "black";
  }, 7000);
}

function sendPowerUp(game, player, type) {
  if (views.props.type != 'online')
      return ;
  game.socket.send(JSON.stringify({
    'type': 'candy_powerup',
    'action': 'candy_powerup',
    'player': player.name,
    'powerup': type,
}))
}