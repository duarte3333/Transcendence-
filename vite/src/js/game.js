import { Score } from './score.js';

// Ball object
const ball = {
  x: 0,
  y: 0,
  radius: 10,
  speedX: 2,
  speedY: 2,
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
    object.x = x;
    object.y = y;
  }

  update() {
    const ball = this.objects.get('ball');

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y + ball.radius > this.canvas.height || ball.y - ball.radius < 0) {
      ball.speedY = -ball.speedY; 
    }

    if (ball.x + ball.radius > this.canvas.width || ball.x - ball.radius < 0) {
      ball.speedX = -ball.speedX;
    }

    ['player_1', 'player_2'].forEach(paddleName => {
      const paddle = this.objects.get(paddleName);
      if (paddle.y < 0) {
        paddle.y = 0;
      } else if (paddle.y + paddle.height > this.canvas.height) {
        paddle.y = this.canvas.height - paddle.height;
      }
    });

  }

  collisionDetection() {
    const ball = this.objects.get('ball');
    const player_1 = this.objects.get('player_1');
    const player_2 = this.objects.get('player_2');

    if (ball.x + ball.radius > player_2.x && ball.y > player_2.y && ball.y < player_2.y + player_2.height) {
      ball.speedX = -ball.speedX;
    }

    if (ball.x - ball.radius < player_1.x + player_1.width && ball.y > player_1.y && ball.y < player_1.y + player_1.height) {
      ball.speedX = -ball.speedX;
    }

    if (ball.x + ball.radius > this.canvas.width) {
      player_1.score.addScore();
      console.log("Player 1 wins");
    }

    if (ball.x - ball.radius < 0) {
      player_2.score.addScore();
      console.log("Player 2 wins");
    }
  }

  showScore() {
    const player_1 = this.objects.get('player_1');
    const player_2 = this.objects.get('player_2');
    this.context.font = "30px Verdana, sans-serif";
    this.context.fillText(player_1.score.getScore(), this.canvas.width / 4, 50);
    this.context.fillText(player_2.score.getScore(), (this.canvas.width / 4) * 3, 50);
  }

  tooglePause() {
    this.pause = !this.pause;
  }

  draw() {
    if (!this.pause) {
      this.update();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.objects.forEach((element) => {
        element.draw();
      });
    }
    else
    {
      //Do that background more transparent when hit pause button
      this.context.font = "30px Verdana, sans-serif";
      this.context.fillText("Paused", this.canvas.width / 2 - 50, this.canvas.height / 2);
      
    }
  }
}

const game = new Game();

document.addEventListener("keydown", (event) => {
  console.log(event.key);
  if (event.key === "ArrowUp") {
    game.move("player_1", playerPaddle.x, playerPaddle.y - 10);
  }
  if (event.key === "ArrowDown") {
    game.move("player_1", playerPaddle.x, playerPaddle.y + 10);
  }
  if (event.key === " ") {
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
