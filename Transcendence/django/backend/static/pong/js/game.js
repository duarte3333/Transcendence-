import { Ball } from "./ball.js";
import { Candy } from "./candy.js";
import { events } from "./events.js";
import { Score, checkGameOver, createScoreBoard, clearScoreBoard } from "./score.js";
import { map } from "./map.js";
import { Paddle, writePaddleNames } from "./paddles.js";
import { sleep } from "./auxFts.js";
import { Banner } from "./banner.js";
import { ClientGame } from "./clientGame.js";

const canvas = document.getElementById("pongCanvas");
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  const canvas = document.getElementById('pongCanvas');
  const banner = document.getElementById('banner');
  const scoreBoard = document.getElementById('scoreBoard');
  const width = canvas.clientWidth;
  canvas.style.height = `${width}px`;
  banner.style.height = `${width}px`;
  scoreBoard.style.height = `${width}px`;
}

export class Game {
  constructor(numPlayers, controlsList) {
    this.playerBanner = new Banner("/static/pong/img/banner.jpeg", "Player's Name", "Lord Pong", "Wins: 10,\n Losses: 2");
    this.objects = new Map();
    this.numCandies = 1;
    this.numberOfPlayers = numPlayers;
    this.pause = false;
    this.speed = 2.5;
    this.isScoring = false;
    this.events = new events(this);
    this.candies = [];
    this.fps = 0;
    this.ball = new Ball();
    this.finish = false;
    this.winner = 0;
    this.winnerName = null;
    this.tournament = null;
    this.paddleNames = [];
    this.gameLoop = null;
    this.loser = null;
    console.log("GAME BETWEEN", controlsList);

    console.log("Game constructor");
    //console.log(controlsList);

    this.client = new ClientGame(numPlayers, controlsList, "paddle_2");
    this.paddleNames = Object.keys(controlsList);
    const row = document.getElementById("game");
    row.style.display = "flex";
    this.context = canvas.getContext("2d");
    this.setupGame(controlsList);
  }

  setupGame(controlsList) {
    this.addMap(map);
    this.addPaddles(controlsList);
    this.addBall();
    this.addCandies();
    createScoreBoard(this.numberOfPlayers);
    this.playerBanner.createBanner();
    resizeCanvas();
    this.init();
  }

  init() {
    this.gameLoop = setInterval(this.draw.bind(this), 1000 / 60);
    setInterval(() => {
      this.fps = 0;
    }, 1000);
    console.log("Game initialized");
  }

  cleanup() {
    clearInterval(this.gameLoop);
    this.events.removeControls();
    this.gameLoop = null;
    this.objects.clear();
    this.finish = false;
    this.winner = null;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("game").style.display = "none";
  }

  addMap(map) {
    map.img.src = "/static/pong/img/lisboa3.png";
    map.pattern.src = "/static/pong/img/cobblestone.jpg"
    map.color =  "teal";
    map.radius = canvas.width / 2;
    map.sides = this.numberOfPlayers * 2;
    map.size = canvas.width;
    if (map.sides < 4) map.sides = 4;
    map.prepareMap();
    map.draw(this.context);
    this.objects.set(map.name, map);
  }

  addPaddles(controlsList) {
    const map = this.objects.get("map");
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      let temp = new Paddle(map, i, this.numberOfPlayers, controlsList[this.paddleNames[i-1]], this.paddleNames[i-1]);
      temp.draw(this.context);
      this.objects.set(temp.name, temp);
    }
  }

  addBall() {
    this.ball.x = canvas.width / 2;
    this.ball.y = canvas.height / 2;
    this.ball.speed *= this.speed;
    this.ball.draw(this.context);
    this.objects.set(this.ball.name, this.ball);
  }

  addCandies() {
    const map = this.objects.get("map");
    for (let i = 1; i <= this.numCandies; i++) {
      const candy = new Candy(map, "candy_" + i);
      this.candies.push(candy);
      this.objects.set(`candy_${i}`, candy);
      sleep(400);
    }
  }

  update() {
    const ball = this.objects.get("ball");

    for (let i = 1; i <= this.numberOfPlayers; i++) {
      let temp = this.objects.get("paddle_" + i);
      temp.move();
      this.client.updatePlayer(temp);
    }
    ball.move(this);
    this.client.updateBall(ball);

    for (let i = 1; i <= this.numCandies; i++) {
      let temp = this.objects.get("candy_" + i);
      this.client.updateCandy(temp);
    }

    let final_i = checkGameOver(this.numberOfPlayers);
    if (final_i != -1) {
      this.finish = true;
      this.winner = final_i;
    }
  }

  togglePause() {
    this.pause = !this.pause;
  }

  draw() {
    this.fps++;
    if (!this.pause && !this.finish) {
      this.update();
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.objects.forEach((element) => {
        element.draw(this.context);
      });

    } else if (this.finish) {
      this.displayGameOver();
    } else if (this.pause) {
      this.displayPaused();
    }
  }

  displayGameOver() {
    // this.cleanup();
    this.context.font = "bold 40px Poppins, sans-serif";
    this.context.fillStyle = "black";
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
    this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
    var gradient = this.context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "white");
    gradient.addColorStop("1", "#759ad7");
    this.context.fillStyle = gradient;
    this.context.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;

    this.context.font = "bold 30px Poppins, sans-serif";
    this.context.fillStyle = "black";
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
    this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
    this.context.fillStyle = gradient;
    this.context.fillText(`Player ${this.winner} wins`, canvas.width / 2 - 100, canvas.height / 2 + 50);
    this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;

    document.getElementById("game").style.display = "none";
    document.getElementById("gameForm").style.display = "block";
    this.winnerName = this.paddleNames[this.winner - 1];
    this.events.removeControls();
    clearScoreBoard();
    this.playerBanner.clearBanner();
    clearInterval(this.gameLoop);

    console.log("Game::Game acabouuu");

  }

  displayPaused() {
    this.client.updatePause(this.pause);
    this.context.font = "bold 40px Poppins, sans-serif";
    this.context.fillStyle = "black";
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
    this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
    var gradient = this.context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "white");
    gradient.addColorStop("1", "#759ad7");
    this.context.fillStyle = gradient;
    this.context.fillText("Paused", canvas.width / 2 - 75, canvas.height / 2);
    this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
    writePaddleNames(this);
  }

  updateGameSpeed(speed) {
    this.speed = 2.5 * speed;
    console.log("Speed updated to: " + this.speed);
    const ball = this.objects.get("ball");
    const player_1 = this.objects.get("player_1");
    const player_2 = this.objects.get("player_2");
    ball.speed = 4 * this.speed;
    player_1.speed = 3 * this.speed;
    player_2.speed = 3 * this.speed;
  }
}
