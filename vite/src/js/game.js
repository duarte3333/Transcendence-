const canvas = document.getElementById("pongCanvas");

import { ball } from "./ball.js";
import { playerPaddle } from "./paddles.js";
import { aiPaddle } from "./paddles.js";
import { candy } from "./candy.js";
import { events } from "./events.js";

class Game {
  
  objects = new Map();
  pause = false;
  speed = 2.5;
  events = new events(this);  // Initialize events after setting up game

  //INITIALIZE GAME
  constructor() {
    this.context = canvas.getContext("2d");
    document.addEventListener('DOMContentLoaded', () => {
      const canvas = document.getElementById("pongCanvas");
      this.context = canvas.getContext("2d");
      this.setupGame();  // Initialize game after setting context
    });
  }

  setupGame() {
    this.addPlayer(playerPaddle);
    this.addPlayer(aiPaddle);
    this.addBall(ball);
    this.addCandy(candy);
    this.init();
  }

  init() {
    setInterval(this.draw.bind(this), 1000 / 60);
    console.log("Game initialized");
  }

  //ADD OBJECTS TO GAME
  addPlayer(paddle) {
    paddle.draw(this.context);
    if (paddle.name === "player_1") paddle.x = 0;
    else paddle.x = canvas.width - paddle.width;
    paddle.y = canvas.height / 2 - 50;
    paddle.speed *= this.speed;
    this.objects.set(paddle.name, paddle);
  }

  addBall(ball) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.draw(this.context);
    ball.speedY *= this.speed;
    ball.speedX *= this.speed;
    this.objects.set(ball.name, ball);
  }

  addCandy(candy) {
    candy.draw(this.context);
    this.objects.set(candy.name, candy);
  }

  //MOVE OBJECTS
  move(name, x, y) {
    const object = this.objects.get(name);
    if (object.name === "player_1" || object.name === "player_2") {
      if (y < 0 || y + object.height > canvas.height) return;
      else {
        object.x = x;
        object.y = y;
      }
    } 
    else {
      object.x = x;
      object.y = y;
    }
  }

  //UPDATE OBJECTS
  update() {
    const ball = this.objects.get("ball");
    const playerPaddle = this.objects.get("player_1");
    const aiPaddle = this.objects.get("player_2");

    //update players paddle
    if (playerPaddle.moveUp) {
      this.move("player_1", playerPaddle.x, playerPaddle.y - playerPaddle.speed);
    } else if (playerPaddle.moveDown) {
      this.move("player_1", playerPaddle.x, playerPaddle.y + playerPaddle.speed);
    }

    // Update the ball's position
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Check for collision with the top and bottom walls
    if (ball.y - ball.radius <= 0) {
      ball.speedY = -ball.speedY;
      ball.y += 1;
    }
    if (ball.y + ball.radius >= canvas.height) {
      ball.speedY = -ball.speedY;
      ball.y -= 1;
    }

    // Check for collision with the player's paddle
    if (
      ball.x - ball.radius <= playerPaddle.x + playerPaddle.width &&
      ball.y + ball.radius >= playerPaddle.y &&
      ball.y - ball.radius <= playerPaddle.y + playerPaddle.height
    ) {
      // Calculate impact point -> a value between -1 and 1
      let impactPoint =
        (ball.y - (playerPaddle.y + playerPaddle.height / 2)) /
        (playerPaddle.height / 2);

      // Modify speed based on where it hit the paddle
      ball.speedY = impactPoint * (5 * this.speed); // The '5' factor controls the influence
      ball.speedX = -ball.speedX; // Reverse the horizontal direction
    }

    // Check for collision with the AI's paddle similarly
    if (
      ball.x + ball.radius >= aiPaddle.x &&
      ball.y + ball.radius >= aiPaddle.y &&
      ball.y - ball.radius <= aiPaddle.y + aiPaddle.height
    ) {
      let impactPoint =
        (ball.y - (aiPaddle.y + aiPaddle.height / 2)) / (aiPaddle.height / 2);

      ball.speedY = impactPoint * (5 * this.speed); // Adjust '5' as needed
      ball.speedX = -ball.speedX;
    }
    this.collisionDetection();
  }

  updateAI() {
    // if (canvas.height - ball.y > 50 && canvas.width - ball.x > 50)
    // {
    const player_2 = this.objects.get("player_2") || this.objects.get("ai");
    if (player_2.name === "ai") {
      if (ball.y < aiPaddle.y + aiPaddle.height / 2 - 10) {
        this.move("player_2", aiPaddle.x, aiPaddle.y - aiPaddle.speed); // Move paddle up
      } else if (ball.y > aiPaddle.y + aiPaddle.height / 2 + 10) {
        this.move("player_2", aiPaddle.x, aiPaddle.y + aiPaddle.speed); // Move paddle down
      }

      // Ensure AI paddle doesn't move out of canvas bounds
      if (aiPaddle.y < 0) {
        aiPaddle.y = 0;
      } else if (aiPaddle.y + aiPaddle.height > canvas.height) {
        aiPaddle.y = canvas.height - aiPaddle.height;
      }
    } else if (player_2.name === "player_2") {
      //update players paddle
      if (aiPaddle.moveUp) {
        this.move(
          "player_2",
          aiPaddle.x,
          aiPaddle.y - aiPaddle.speed
        );
      } else if (aiPaddle.moveDown) {
        this.move(
          "player_2",
          aiPaddle.x,
          aiPaddle.y + aiPaddle.speed
        );
      }
    }
  }

  collisionDetection() {
    const ball = this.objects.get("ball");
    const player_1 = this.objects.get("player_1");
    const player_2 = this.objects.get("player_2");

    if (
      ball.x + ball.radius > player_2.x &&
      ball.y > player_2.y &&
      ball.y < player_2.y + player_2.height
    ) {
      ball.speedX = -ball.speedX;
      player_2.lastHit = true;
      player_1.lastHit = false;
    }

    if (
      ball.x - ball.radius < player_1.x + player_1.width &&
      ball.y > player_1.y &&
      ball.y < player_1.y + player_1.height
    ) {
      ball.speedX = -ball.speedX;
      player_1.lastHit = true;
      player_2.lastHit = false;
    }

    if (ball.x + ball.radius > canvas.width) {
      player_1.score.addScore();
      this.resartBall();
      console.log("Player 1 wins");
      ball.speedY /= 2;
      ball.speedX /= 2;
      setTimeout(function() {
        ball.speedY *= 2;
      ball.speedX *= 2;
    }, 1400);
    console.log("End");
    }

    if (ball.x - ball.radius < 0) {
      console.log();
      player_2.score.addScore();
      this.resartBall();
      ball.speedX *= -1;
      console.log("Player 2 wins");
      ball.speedY /= 2;
      ball.speedX /= 2;
      setTimeout(function() {
        ball.speedY *= 2;
      ball.speedX *= 2;
    }, 1400);
    }

    if (candy.visible && candy.ballCollidesWithCandy(ball, candy)) {
      console.log("Candy collected");
      if (player_1.lastHit) player_2.height *= 0.9; player_1.height *= 1.1;
      if (player_2.lastHit) player_1.height *= 0.9; player_2.height *= 1.1;
      candy.visible = false;
      candy.reset(canvas.width, canvas.height, 50);
    }
  }

  

  showScore() {
    const player_1 = this.objects.get("player_1");
    const player_2 = this.objects.get("player_2");
    this.context.font = "25px Verdana, sans-serif";
    this.context.colortext = "white";
    this.context.fillText(player_1.score.getScore(), canvas.width / 4, 50);
    this.context.fillText(
      player_2.score.getScore(),
      (canvas.width / 4) * 3,
      50
    );
  }

  tooglePause() {
    this.pause = !this.pause;
  }

  resartBall() {
    const ball = this.objects.get("ball");
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 4 * this.speed;
    ball.speedY = 0 * this.speed;
  }

  draw() {
    if (!this.pause) {
      this.update();
      this.updateAI();
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.objects.forEach((element) => {
        element.draw(this.context);
      });
      this.showScore();
    } else {
      //Do that background more transparent when hit pause button
      this.context.font = "30px Verdana, sans-serif";
      this.context.fillText(
        "Paused",
        canvas.width / 2 - 50,
        canvas.height / 2
      );
    }
  }

  updateGameSpeed(speed) {
    this.speed = 2.5 * speed;
    console.log("Speed updated to: " + this.speed);
    const ball = this.objects.get("ball");
    const player_1 = this.objects.get("player_1");
    const player_2 = this.objects.get("player_2");
    ball.speedX = 4 * this.speed;
    ball.speedY = 4 * this.speed;
    player_1.speed = 3 * this.speed;
    player_2.speed = 3 * this.speed;
  }
}

const game = new Game();



//MOUSE MOVE FT WITH HARDCODED height betweeen canvas 0 and screen 0 (y)
// document.addEventListener("mousemove", (event) => {
//   // event.preventDefault();
//   const mouseY = event.clientY - 150;
//   console.log(`${mouseY}`);
//   const playerPaddle = game.objects.get("player_1");
//   if (mouseY > playerPaddle.y + playerPaddle.height) {
//     event.preventDefault();
//     playerPaddle.moveDown = true;
//   }
//   else if (mouseY < playerPaddle.y) {
//     event.preventDefault();
//     playerPaddle.moveUp= true;

//   }
//   else {
//     playerPaddle.moveUp = false;
//     playerPaddle.moveDown = false;
//   }
// });