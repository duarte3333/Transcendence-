import { Score } from "./score.js";

// Ball object
const ball = {
  x: 0,
  y: 0,
  radius: 10,
  speedX: 4,
  speedY: 4,
  color: "white",
  name: "ball",
};

// Paddles
const playerPaddle = {
  width: 10,
  height: 100,
  x: 0,
  y: 0,
  name: "player_1",
  color: "white",
  score: new Score(),
};

const aiPaddle = {
  width: 10,
  height: 100,
  x: 0,
  y: 0,
  name: "player_2",
  color: "white",
  score: new Score(),
};

class Game {
  objects = new Map();
  pause = false;

  constructor() {
    this.canvas = document.getElementById("pongCanvas");
    this.context = this.canvas.getContext("2d");
  }

  init() {
    setInterval(this.draw.bind(this), 1000 / 60);
    console.log("Game initialized");
  }
  addPlayer(paddle) {
    paddle.draw = () => {
      this.context.fillStyle = paddle.color;
      this.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    };
    if (paddle.name === "player_1") paddle.x = 0;
    else paddle.x = this.canvas.width - paddle.width;

    paddle.y = this.canvas.height / 2 - 50;
    this.objects.set(paddle.name, paddle);
  }

  addBall(ball) {
    ball.x = this.canvas.width / 2;
    ball.y = this.canvas.height / 2;
    ball.draw = () => {
      this.context.fillStyle = ball.color;
      this.context.beginPath();
      this.context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
      this.context.closePath();
      this.context.fill();
    };
    this.objects.set(ball.name, ball);
  }

  move(name, x, y) {
    const object = this.objects.get(name);
    if (object.name === "player_1" || object.name === "player_2") {
      if (y < 0 || y + object.height > this.canvas.height) return;
      else {
        object.x = x;
        object.y = y;
      }
    } else {
      object.x = x;
      object.y = y;
    }
  }

  update() {
    const ball = this.objects.get("ball");
    const playerPaddle = this.objects.get("player_1");
    const aiPaddle = this.objects.get("player_2");

    // Update the ball's position
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Check for collision with the top and bottom walls
    if (
      ball.y - ball.radius <= 0 ||
      ball.y + ball.radius >= this.canvas.height
    ) {
      ball.speedY = -ball.speedY;
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
      ball.speedY = impactPoint * 5; // The '5' factor controls the influence
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

      ball.speedY = impactPoint * 5; // Adjust '5' as needed
      ball.speedX = -ball.speedX;
    }
    this.collisionDetection();
  }

  updateAI() { 
      if (ball.y < aiPaddle.y + aiPaddle.height / 2) {
          aiPaddle.y -= 3; // Move paddle up
      } else if (ball.y > aiPaddle.y + aiPaddle.height / 2) {
          aiPaddle.y += 3; // Move paddle down
      }

      // Introduce error sometimes
      if (Math.random() < 0.10) { // 10% chance to make a mistake
          // Mistake is moving in the opposite direction
          if (Math.random() < 0.5) {
              aiPaddle.y += 5; // Move incorrectly down
          } else {
              aiPaddle.y -= 5; // Move incorrectly up
          }
      }

      // Ensure AI paddle doesn't move out of canvas bounds
      if (aiPaddle.y < 0) {
          aiPaddle.y = 0;
      } else if (aiPaddle.y + aiPaddle.height > this.canvas.height) {
          aiPaddle.y = this.canvas.height - aiPaddle.height;
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
    }

    if (
      ball.x - ball.radius < player_1.x + player_1.width &&
      ball.y > player_1.y &&
      ball.y < player_1.y + player_1.height
    ) {
      ball.speedX = -ball.speedX;
    }

    if (ball.x + ball.radius > this.canvas.width) {
      player_1.score.addScore();
      this.resartBall();
      console.log("Player 1 wins");
    }

    if (ball.x - ball.radius < 0) {
      player_2.score.addScore();
      this.resartBall();
      console.log("Player 2 wins");
    }
  }

  showScore() {
    const player_1 = this.objects.get("player_1");
    const player_2 = this.objects.get("player_2");
    this.context.font = "25px Verdana, sans-serif";
    this.context.fillText(player_1.score.getScore(), this.canvas.width / 4, 50);
    this.context.fillText(
      player_2.score.getScore(),
      (this.canvas.width / 4) * 3,
      50
    );
  }

  tooglePause() {
    this.pause = !this.pause;
  }

  resartBall() {
    const ball = this.objects.get("ball");
    ball.x = this.canvas.width / 2;
    ball.y = this.canvas.height / 2;
    ball.speedX = 4;
    ball.speedY = 4;
  }

  draw() {
    if (!this.pause) {
      this.update();
      this.updateAI();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.objects.forEach((element) => {
        element.draw();
      });
      this.showScore();
    } else {
      //Do that background more transparent when hit pause button
      this.context.font = "30px Verdana, sans-serif";
      this.context.fillText(
        "Paused",
        this.canvas.width / 2 - 50,
        this.canvas.height / 2
      );
    }
  }
}

const game = new Game();

document.addEventListener("keydown", (event) => {
  console.log(event.key);
  if (event.key === "ArrowUp") {
    event.preventDefault();
    game.move("player_1", playerPaddle.x, playerPaddle.y - 10);
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    game.move("player_1", playerPaddle.x, playerPaddle.y + 10);
  }
  if (event.key === " ") {
    event.preventDefault();
    console.log("Space");
    game.tooglePause();
  }
});

document.addEventListener("DOMContentLoaded", (event) => {
  game.addPlayer(playerPaddle);
  game.addPlayer(aiPaddle);
  game.addBall(ball);
  game.init();
});
