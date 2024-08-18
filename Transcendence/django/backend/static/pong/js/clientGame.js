import { Ball } from "./ball.js";
import { Candy } from "./candy.js";
import { events } from "./events.js";
import { Score } from "./score.js";
import { map } from "./map.js";
import { Paddle } from "./paddles.js"
import { sleep } from "./auxFts.js";
import { createScoreBoard } from "./score.js";
import { Banner } from "./banner.js";

function resizeCanvas() {
  const canvas = document.getElementById('clientPong');
  const banner = document.getElementById('banner');
  const scoreBoard = document.getElementById('scoreBoard');
  const width = window.innerWidth;  // More reliable measurement of the viewport width
  if (canvas) {
    canvas.width = width;  // Set the canvas width to fill the container or viewport
    canvas.height = width;  // Maintain a 1:1 aspect ratio for the canvas
  
    const heightProportion = width / 5;  // Example proportion based on design needs
    banner.style.height = `${heightProportion}px`;  // Set proportionally smaller than canvas
    scoreBoard.style.height = `${heightProportion}px`;  // Same as banner
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

export class ClientGame {
//   playerBanner = new Banner("/static/pong/img/banner.jpeg", "Player's Name");
  canvas = document.getElementById("clientPong");
  playerName;
  objects = new Map();
  numCandies = 1;
  // numberOfPlayers = 2;
  pause = false;
  speed = 2.5;
  isScoring = false;
  score = new Score()
  events = new events(this);  // Initialize events after setting up game
  candies = [];
  fps = 0;
  ball = new Ball();
  paddleNames = [];


  //INITIALIZE GAME
  constructor(numPlayers, controlsList, playerName) {
    console.log("Client Game constructor");
    //console.log(controlsList);
    this.numberOfPlayers = numPlayers;
	  this.playerName = playerName;
    this.paddleNames = Object.keys(controlsList);
    //console.log(this.paddleNames);
	  const row = document.getElementById("clientGame");
    //row.style.display = "flex";
    this.context = this.canvas.getContext("2d");
    this.setupGame(controlsList);  // Initialize game after setting context
  }
  
  setupGame(controlsList) {
    //console.log("Setting up client game");
    //console.log(controlsList);
    this.addMap(map);
    this.addPaddles(controlsList);
    this.addBall();
    this.addCandies();
    // createScoreBoard(this.numberOfPlayers);
	  // this.playerBanner.createBanner();
    resizeCanvas();
    this.init();
  }

  init() {
    setInterval(this.draw.bind(this), 1000 / 60);
    setInterval(() => {
      // console.log(`fps = ${this.fps}`);
      this.fps = 0;
    }, 1000);
    //console.log("Client Game initialized");
  }

  //ADD OBJECTS TO GAME
  addMap(map) {
    map.img.src = "/static/pong/img/lisboa3.png";
    map.pattern.src = "/static/pong/img/cobblestone.jpg";
    map.color =  "teal";
    map.radius = this.canvas.width / 2;
    map.sides = this.numberOfPlayers * 2;
    map.size = this.canvas.width;
    if (map.sides < 4) //protect in case there is only one player and player * 2 is equal to 2
      map.sides = 4;
    map.prepareMap();
    map.draw(this.context);
    this.objects.set(map.name, map);
  }

  addPaddles(controlsList) {
    //console.log("Adding paddles");
    //console.log(controlsList);
    const map = this.objects.get("map");
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      //console.log(this.paddleNames[i-1]);
      //console.log(controlsList[this.paddleNames[i-1]]);
      let temp = new Paddle(map, i, this.numberOfPlayers, controlsList[this.paddleNames[i-1]], this.paddleNames[i-1]);
      // temp.print();
      temp.draw(this.context);
      this.objects.set(temp.name, temp);
    }
  }

  addBall() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;
    this.ball.speed = 0;
	  this.ball.speedX = 0;
	  this.ball.speedY = 0;
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

  //client calls for updates
  updateBall(hostBall) {
    this.ball.x = hostBall.x;
    this.ball.y = hostBall.y;
    this.ball.visible = hostBall.visible;
  }

  updatePlayer(hostPaddle) {
    const clientPaddle = this.objects.get(hostPaddle.name);
    clientPaddle.x = hostPaddle.x;
    clientPaddle.y = hostPaddle.y;
    clientPaddle.height = hostPaddle.height;
    clientPaddle.color = hostPaddle.color;
    clientPaddle.updateRectMap();
  }

  updateCandy(hostCandy) {
    const clientCandy = this.objects.get(hostCandy.name);
    clientCandy.x = hostCandy.x;
    clientCandy.y = hostCandy.y;
    clientCandy.visible = hostCandy.visible;
  }

  updatePause(hostPause) {
    this.pause = hostPause;
  }

  //UPDATE OBJECTS
  update() {
	  const temp = this.objects.get(this.playerName);
	  temp.move;
  }

  tooglePause() {
    this.pause = !this.pause;
  }

  draw() {
    this.fps++;
    if (!this.pause) {
      this.update();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.objects.forEach((element) => {
        element.draw(this.context);
      });
    } else {
      this.context.font = "bold 40px Poppins, sans-serif";
      this.context.fillStyle = "black";
      this.context.shadowColor = "rgba(0, 0, 0, 0.5)"; 
      this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
      var gradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
      gradient.addColorStop("0", "white"); gradient.addColorStop("1", "#759ad7"); // light blue
      this.context.fillStyle = gradient;
      this.context.fillText("Paused", this.canvas.width / 2 - 75, this.canvas.height / 2);
      this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
    }
  }
}
