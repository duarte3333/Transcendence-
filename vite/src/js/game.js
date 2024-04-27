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
};

const aiPaddle = {
  width: 10,
  height: 100,
  x: 0,
  y: 0,
  name: "player_2",
  color: "white",
};

class Game {
  objects = new Map();

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

  addPaddle(paddle) {}

  move(name, x, y) {
    const object = this.objects.get(name);
    object.x = x;
    object.y = y;
  }

  update() {
    // this.move('ball', ball.x + 1, ball.y);
  }

  draw() {
    this.update();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.objects.forEach((element) => {
      element.draw();
    });
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
});

document.addEventListener("DOMContentLoaded", (event) => {
  game.addPlayer(playerPaddle);
  game.addPlayer(aiPaddle);
  game.addBall(ball);
  game.init();
});
