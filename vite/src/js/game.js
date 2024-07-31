import { Ball } from "./ball.js";
import { Candy } from "./candy.js";
import { events } from "./events.js";
import { Score, checkGameOver } from "./score.js";
import { map } from "./map.js";
import { Paddle, writePaddleNames } from "./paddles.js"
import { createScoreBoard } from "./score.js";
import { sleep } from "./auxFts.js";
import { Banner } from "./banner.js";
import { ClientGame } from "./clientGame.js";
import { Tournament } from "./tournament.js";

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

// function resizeCanvas() {
//   const canvas = document.getElementById('clientPong');
//   const banner = document.getElementById('banner');
//   //const scoreBoard = document.getElementById('scoreBoard');
  
  
//   const width = window.innerWidth;  // More reliable measurement of the viewport width
//   canvas.width = width;  // Set the canvas width to fill the container or viewport
//   canvas.height = width;  // Maintain a 1:1 aspect ratio for the canvas

//   const heightProportion = width / 5;  // Example proportion based on design needs
//   banner.style.height = `${heightProportion}px`;  // Set proportionally smaller than canvas
//   //scoreBoard.style.height = `${canvas.height}px`;  // Same as banner
// }

export class Game {
  playerBanner = new Banner("../img/banner.jpeg", "Player's Name", "Lord Pong", "Wins: 10,\n Losses: 2");
  objects = new Map();
  numCandies = 1;
  numberOfPlayers = 2;
  pause = false;
  speed = 2.5;
  isScoring = false;
  events = new events(this);  // Initialize events after setting up game
  candies = [];
  fps = 0;
  ball = new Ball();
  finish = false;
  winner = 0;
  tournament = null;

  //INITIALIZE GAME
  constructor(numPlayers, controlsList) {
    this.client = new ClientGame(numPlayers, controlsList, "paddle_2"); //<-- CLIENT GAME
    this.numberOfPlayers = numPlayers;
    const row = document.getElementById("game");
    row.style.display = "flex";
    const canvas = document.getElementById("pongCanvas");
    this.context = canvas.getContext("2d");
    this.setupGame(controlsList);  // Initialize game after setting context
  }
  
  setupGame(controlsList) {
    this.addMap(map);
    this.addPaddles(controlsList);
    this.addBall();
    this.addCandies();
    createScoreBoard(this.numberOfPlayers);
    this.playerBanner.createBanner();
    resizeCanvas();
    const temp = document.getElementById("scoreBoard");
    this.init();
  } 

  init() {
    setInterval(this.draw.bind(this), 1000 / 60);
    setInterval(() => {
      // console.log(`fps = ${this.fps}`);
      this.fps = 0;
    }, 1000);
    console.log("Game initialized");
  }

  //ADD OBJECTS TO GAME
  addMap(map) {
    map.img.src = "../img/lisboa3.png";
    map.pattern.src = "../img/cobblestone.jpg"
    map.color =  "teal";
    map.radius = canvas.width / 2;
    map.sides = this.numberOfPlayers * 2;
    map.size = canvas.width;
    if (map.sides < 4) //protect in case there is only one player and player * 2 is equal to 2
      map.sides = 4;
    map.prepareMap();
    map.draw(this.context);
    this.objects.set(map.name, map);
  }

  addPaddles(controlsList) {
    const map = this.objects.get("map");
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      let temp = new Paddle(map, i, this.numberOfPlayers, controlsList[`Player${i}`]);
      // temp.print();
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

  //UPDATE OBJECTS
  update() {
    const ball = this.objects.get("ball");

    //Update players paddle and ball
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      let temp = this.objects.get("paddle_" + i);
      temp.move();
      //send paddle info to client
      this.client.updatePlayer(temp);
    }
    ball.move(this);
    //send ball info to client
    this.client.updateBall(ball);
    //send candy info to client
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

  tooglePause() {
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

    } 
    else if (this.finish) {
      
      
      this.context.font = "bold 40px Poppins, sans-serif";
      this.context.fillStyle = "black";
      this.context.shadowColor = "rgba(0, 0, 0, 0.5)"; 
      this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
      var gradient = this.context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop("0", "white"); gradient.addColorStop("1", "#759ad7"); // light blue
      this.context.fillStyle = gradient;
      this.context.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
      this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadow
      //tell who wins
      this.context.font = "bold 30px Poppins, sans-serif";
      this.context.fillStyle = "black";
      this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
      this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
      this.context.fillStyle = gradient;
      this.context.fillText(`Player ${this.winner} wins`, canvas.width / 2 - 100, canvas.height / 2 + 50);
      this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
    }
    else if(this.pause){
      this.client.updatePause(this.pause);
      this.context.font = "bold 40px Poppins, sans-serif";
      this.context.fillStyle = "black";
      this.context.shadowColor = "rgba(0, 0, 0, 0.5)"; 
      this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
      var gradient = this.context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop("0", "white"); gradient.addColorStop("1", "#759ad7"); // light blue
      this.context.fillStyle = gradient;
      this.context.fillText("Paused", canvas.width / 2 - 75, canvas.height / 2);
      this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
      writePaddleNames(this);
    }
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