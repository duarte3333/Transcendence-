import { Ball } from "./ball.js";
import { Candy } from "./candy.js";
import { events } from "./events.js";
import { Score, checkGameOver, createScoreBoard, clearScoreBoard } from "./score.js";
import { map } from "./map.js";
import { Paddle, writePaddleNames } from "./paddles.js";
import { sleep } from "./auxFts.js";
import { Banner } from "./banner.js";
import { socket } from "./myWebSocket.js";
import { views } from "../../main/js/main.js";




function resizeCanvas() {
  const canvas = document.getElementById("pongCanvas");
  const banner = document.getElementById('banner');
  const scoreBoard = document.getElementById('scoreBoard');
  const width = canvas.clientWidth;
  canvas.style.height = `${width}px`;
  banner.style.height = `${width}px`;
  scoreBoard.style.height = `${width}px`;
}

export class Game {
  constructor(numPlayers, controlsList) {
    // console.log("controlsList")
    // console.log(numPlayers)
    // console.log(controlsList)
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
    this.canvas = document.getElementById("pongCanvas");
    window.addEventListener('resize', () => {
      resizeCanvas();
    });
    // console.log("GAME BETWEEN", controlsList);
    // console.log("Game constructor: ", views.props);
    //console.log(controlsList);

    // this.client = new ClientGame(numPlayers, controlsList, "paddle_2");
    this.paddleNames = Object.keys(controlsList);
    const row = document.getElementById("game");
    row.style.display = "flex";
    this.context = this.canvas.getContext("2d");
    this.events.handleKeyDown = this.handleKeyDown.bind(this);
    this.events.handleKeyUp = this.handleKeyUp.bind(this);
    this.setupGame(controlsList);
  }


  handleKeyDown(event) {
    // console.log("handleKeyDown")
    for (let i = 1; i <= this.numberOfPlayers; i++) {
        let temp = this.objects.get("paddle_" + i);
        if (event.key == temp.moveUpKey) {
            event.preventDefault();
            temp.moveUp = true;
        }
        else if (event.key == temp.moveDownKey) {
            event.preventDefault();
            temp.moveDown = true;
        }
    }
    if (event.key == " ") {
        event.preventDefault();
        this.pause = !this.pause;
    }
  }

  handleKeyUp(event) {
    // console.log("handleKeyUp")
    for (let i = 1; i <= this.numberOfPlayers; i++) {
        let temp = this.objects.get("paddle_" + i);
        if (event.key == temp.moveUpKey) {
            event.preventDefault();
            temp.moveUp = false;
        }
        else if (event.key == temp.moveDownKey) {
            event.preventDefault();
            temp.moveDown = false;
        }
    }
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
    // if (!socket)
    //   initializeWebSocket();
  }

  init() {
    resizeCanvas();
    this.gameLoop = setInterval(this.draw.bind(this), 1000 / 60);
    // setInterval(() => {
    //   this.fps = 0;
    // }, 1000);
    console.log("Game initialized");
  }

  cleanup() {
    clearInterval(this.gameLoop);
    this.events.removeControls();
    this.gameLoop = null;
    this.objects.clear();
    this.finish = false;
    this.winner = null;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    document.getElementById("game").style.display = "none";
  }

  addMap(map) {
    map.img.src = "/static/pong/img/lisboa3.png";
    map.pattern.src = "/static/pong/img/cobblestone.jpg"
    map.color =  "teal";
    map.radius = this.canvas.width / 2;
    map.sides = this.numberOfPlayers * 2;
    map.size = this.canvas.width;
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
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;
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

  sendPaddleUpdate(paddle, name) {
    if (socket) {
      // console.log(`paddle_x: ${paddle.x}, paddle_y: ${paddle.y}`);
      socket.send(JSON.stringify({
        'type': 'paddle_update',
        'paddle_x': paddle.x,
        'paddle_y': paddle.y,
        'sender': name
      }))
    } 
  }
  
  sendBallUpdate(ball) {
    if (socket) {
      // console.log(`ball_x: ${ball.x}, ball_y: ${ball.y}`);
      socket.send(JSON.stringify({
        'type': 'ball_update',
        'ball_x': ball.x,
        'ball_y': ball.y,
      }))
    }
  }

    //UPDATE OBJECTS
  update() {
    const ball = this.objects.get("ball");

    //Update players paddle and ball
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      let paddle = this.objects.get("paddle_" + i);
      paddle.move();
      //send paddle info to client
      this.sendPaddleUpdate(paddle);
      // this.client.updatePlayer(paddle);
    }
    ball.move(this);
    //send ball info to client
    this.sendBallUpdate(ball);
    // this.client.updateBall(ball);
    //send candy info to client
    for (let i = 1; i <= this.numCandies; i++) {
      let temp = this.objects.get("candy_" + i);
      // this.client.updateCandy(temp);
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
      this.context.clearRect(0, 0, this.canvas.width,this.canvas.height);
      this.objects.forEach((element) => {
        element.draw(this.context);
      });

    } 
    else if (this.finish) {
      this.context.font = "bold 40px Poppins, sans-serif";
      this.context.fillStyle = "black";
      this.context.shadowColor = "rgba(0, 0, 0, 0.5)"; 
      this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
      var gradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
      gradient.addColorStop("0", "white"); gradient.addColorStop("1", "#759ad7"); // light blue
      this.context.fillStyle = gradient;
      this.context.fillText("Game Over", this.canvas.width / 2 - 100, this.canvas.height / 2);
      this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
      //tell who wins
      this.context.font = "bold 30px Poppins, sans-serif";
      this.context.fillStyle = "black";
      this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
      this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
      this.context.fillStyle = gradient;
      this.context.fillText(`Player ${this.winner} wins`, this.canvas.width / 2 - 100, this.canvas.height / 2 + 50);
      this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
    }
    else if(this.pause){
      // this.client.updatePause(this.pause);
      this.context.font = "bold 40px Poppins, sans-serif";
      this.context.fillStyle = "black";
      this.context.shadowColor = "rgba(0, 0, 0, 0.5)"; 
      this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
      var gradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
      gradient.addColorStop("0", "white"); gradient.addColorStop("1", "#759ad7"); // light blue
      this.context.fillStyle = gradient;
      this.context.fillText("Paused", this.canvas.width / 2 - 75, this.canvas.height / 2);
      this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
      writePaddleNames(this);
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
    var gradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
    gradient.addColorStop("0", "white");
    gradient.addColorStop("1", "#759ad7");
    this.context.fillStyle = gradient;
    this.context.fillText("Game Over", this.canvas.width / 2 - 100, this.canvas.height / 2);
    this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;

    this.context.font = "bold 30px Poppins, sans-serif";
    this.context.fillStyle = "black";
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
    this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
    this.context.fillStyle = gradient;
    this.context.fillText(`Player ${this.winner} wins`, this.canvas.width / 2 - 100, this.canvas.height / 2 + 50);
    this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;

    document.getElementById("game").style.display = "none";
    document.getElementById("gameForm").style.display = "block";
    this.winnerName = this.paddleNames[this.winner - 1];
    this.events.removeControls();
    clearScoreBoard();
    this.playerBanner.clearBanner();
    clearInterval(this.gameLoop);

    // console.log("Game::Game acabouuu");

  }

  displayPaused() {
    // this.client.updatePause(this.pause);
    this.context.font = "bold 40px Poppins, sans-serif";
    this.context.fillStyle = "black";
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
    this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
    var gradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
    gradient.addColorStop("0", "white");
    gradient.addColorStop("1", "#759ad7");
    this.context.fillStyle = gradient;
    this.context.fillText("Paused", this.canvas.width / 2 - 75, this.canvas.height / 2);
    this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
    writePaddleNames(this);
  }

  updateGameSpeed(speed) {
    this.speed = 2.5 * speed;
    // console.log("Speed updated to: " + this.speed);
    const ball = this.objects.get("ball");
    const player_1 = this.objects.get("player_1");
    const player_2 = this.objects.get("player_2");
    ball.speed = 4 * this.speed;
    player_1.speed = 3 * this.speed;
    player_2.speed = 3 * this.speed;
  }



  initializeWebSocket(id, playerId){
    const chatSocket = new WebSocket(
       `ws://localhost:8000/ws/game/${id}/`
    );
  
    chatSocket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      console.log('Message:', data);
    };
  
    chatSocket.onclose = function(e) {
      console.error('Chat socket closed unexpectedly');
    };
  
    // Enviar uma mensagem
    chatSocket.onopen = function(e) {
      chatSocket.send(JSON.stringify({
        'playerId': playerId,
        'action': 'join'
      }));
    };
  
  }

  destroyer() {
    clearInterval(this.gameLoop);
  }
}

let game = undefined;

views.setElement('/game', (state) => {
  const data = {
    "1": [
      "ArrowUp",
      "ArrowDown"
    ],
    "2": [
      "w",
      "s"
    ]
  }
  // console.log("game: ", game)
  if (state == "block")
    game = new Game(2, data);
  else
  {
    game?.destroyer();
    game = undefined;
  }

})
.setChilds(["/navbar", "/footer"])
.setEvents();