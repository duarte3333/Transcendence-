import { Ball } from "./ball.js";
import { Candy, speedPowerUp, attackPowerUp, defencePowerUp } from "./candy.js";
import { events } from "./events.js";
import { atualizeScore, createScoreBoard, clearScoreBoard } from "./score.js";
import { map } from "./map.js";
import { Paddle, writePaddleNames } from "./paddles.js";
import { getCookie } from "./auxFts.js";
import { sleep } from "./auxFts.js";
import { Banner } from "./banner.js";
import { socket } from "./myWebSocket.js";
import { views } from "../../main/js/main.js";
// import { AppControl } from "../../main/js/AppControl.js";

const gameData = {game:undefined};
let socketGame = undefined;

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
  constructor(numPlayers, controlsList, playerHost = undefined) {
    // console.log("controlsList")
    // console.log(numPlayers)
    // console.log(controlsList)
    this.playerHost = playerHost;

    this.players = new Map();
    this.score = new Map();
    this.playerBanner = new Banner("/static/pong/img/banner.jpeg", "Player's Name", "Lord Pong", "Wins: 10,\n Losses: 2");
    this.objects = new Map();
    this.numCandies = 1;
    this.numberOfPlayers = numPlayers;
    this.pause = false;
    this.speed = 2.5;
    // this.isScoring = false;
    this.events = new events();
    this.candies = [];
    this.fps = 0;
    this.maxScore = 5;
    this.ball = new Ball();
    this.finish = false;
    this.winner = undefined;
    this.winnerName = null;
    this.tournament = null;
    this.paddleNames = [];
    this.gameLoop = null;
    this.loser = null;
    this.resizeCanvasEvent = () => {
      resizeCanvas();
    }
    // this.boundHandleKeyDownOnline = this.handleKeyDownOnline.bind(this);
    // this.boundHandleKeyUpOnline = this.handleKeyUpOnline.bind(this);
    this.canvas = document.getElementById("pongCanvas");
    // resizeCanvas();
    window.addEventListener('resize', this.resizeCanvasEvent);

    // this.client = new ClientGame(numPlayers, controlsList, "paddle_2");
    this.paddleNames = Object.keys(controlsList);
    if (views.props.type == 'online')
      this.playerDisplays = Object.values(controlsList).map(arr => arr[2]);
    else
      this.playerDisplays = this.paddleNames;
    console.log("paddle names = ", this.paddleNames);
    // console.log("controllist = ", controlsList);

    this.context = this.canvas.getContext("2d");

    console.log("fun =", views.props.fun)
    if (views.props.fun == "false") {
      this.candies = 0;
    }

    // if (views.props.type == 'online') {
    //   // this.pause = true;
    //   document.addEventListener("keydown", this.boundHandleKeyDownOnline);
    //   document.addEventListener("keydown", this.boundHandleKeyUpOnline);

    // }
    // else if (views.props.type == 'local'){
    //   // this.events.setupControls(controlsList, this.handleKeyDown.bind(this), this.handleKeyUp.bind(this));
    // }

  }

  handleKeyDown(event) {
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
    createScoreBoard(this.score);
    this.playerBanner.createBanner();
    resizeCanvas();
    this.init();
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
    // this.events.removeControls();
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
      let paddle = new Paddle(map, i, this.numberOfPlayers, controlsList[this.paddleNames[i-1]], this.playerDisplays[i-1]); // <-- last param display name

      paddle.draw(this.context);
      this.objects.set(paddle.name, paddle);
      this.players.set(this.paddleNames[i-1], paddle);
      this.score.set(this.playerDisplays[i-1], 0);
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
    if (this.candies <= 0)
      return ;
    const map = this.objects.get("map");
    for (let i = 1; i <= this.numCandies; i++) {
      const candy = new Candy(map, "candy_" + i);
      this.candies.push(candy);
      this.objects.set(`candy_${i}`, candy);
      if (window.user.id == this.playerHost) {
        // console.log("inside if");
        candy.sendCandy(gameData.game);
      }
    }
  }

  setCandy(data) {
    // console.log("set candy in client data action == ", data);
    const candy = this.candies.find(candy => candy.name === data.name);
    candy.x = data.x;
    candy.y = data.y;
    candy.visible = data.visibility;
  }

  activateCandy(data) {
    const player = this.objects.get(data.player);
    if (!player) {
      console.log("couldn't get player, name data provided =", data.player);
      return ;
    }
    if (data.powerup == "speed")
      speedPowerUp(player, this);
    else if (data.powerup == "defence")
      defencePowerUp(player, this);
    else if (data.powerup == "attack")
      attackPowerUp(player, this);
  }

  //UPDATE OBJECTS
  update() {
    const ball = this.objects.get("ball");

    // for (let i = 1; i <= this.numberOfPlayers; i++) {
    //   let paddle = this.objects.get("paddle_" + i);
    //   paddle.move();
    //   // this.client.updatePlayer(paddle);
    // }
    if (views.props.type != "online" || window.user.id ==  this.playerHost) {
      ball.move(this);
      if (this.candies > 0) {
        this.candies.forEach( (candy) => {
          candy.sendCandy(this);
        })
      }
    }
    //send candy info to client
    // for (let i = 1; i <= this.numCandies; i++) {
    //   let temp = this.objects.get("candy_" + i);
    //   // this.client.updateCandy(temp);
    // }

    let gameOver = this.checkGameOver();
    if (gameOver) {
      console.log("players final ==", this.players);
      console.log("score final ==", this.score);
      this.winner = gameOver;
    }
  }

  checkGameOver() {
    let display_name;
    for (const [key, value] of this.score.entries()) {
      if (value >= this.maxScore)
        display_name = key;
    }
    for (const [key, value] of this.players.entries()) {
      if (value.displayName == display_name)
        return key;
    }
  }

  togglePause() {
    this.pause = !this.pause;
    if (views.props.type == 'online')
      this.sendPause();
  }

  updateScore(paddle_name, flag) {
    const display_name = this.objects.get(paddle_name).displayName;
    let score = this.score.get(display_name);
    if (flag)
      score++;
    else 
      score--;
    this.score.set(display_name, score);
    this.sendScore(display_name, score);
    atualizeScore(this);
  }

  sendPause() {
    // console.log("sending pause =",!this.pause);
    this.socket.send(JSON.stringify({
      'type': 'pause_game',
      'action': 'pause_game',
      'flag': this.pause,
  }))
  }

  disconnect(disconnectId) {
    // console.log("i am disconnecting");
    const finalScore = []

    for (const [key, player] of this.players.entries()) {
      if (key == disconnectId) {
        finalScore.push({
          id: key, 
          score: "disconnect"
        });
      } else {
        finalScore.push({
          id: key, 
          score: this.score.get(player.displayName) || 0
        });
      }
    }
    this.winner = "disconnect";
    // console.log(">>>>>> ", finalScore);
    // return ;

    setTimeout( async () => {
      if (views.props.type == 'online')
        await this.socket.send(JSON.stringify({
          'type': 'game_end',
          'action': 'game_end',
          'score': finalScore,
          'winner': this.winner,
      }))
    }, 3500);
  }

  sendScore(display_name, score) {
    // sends all score 
    for (const [key, value] of this.score.entries()) {
        this.socket.send(JSON.stringify({
            'type': 'score',
            'action': 'score_update',
            'display_name': key,
            'score': value,
        }))
      }
  }

  async sendGameOver() {
    //put ids with their scores and not display names with their scores
    const finalScore = []

    for (const [key, player] of this.players.entries()) {
      finalScore.push({
        id: key, 
        score: this.score.get(player.displayName) || 0
      });
    }

    // console.log(">>>>>> ", finalScore);
    // return ;

    this.socket.send(JSON.stringify({
      'type': 'game_end',
      'action': 'game_end',
      'score': finalScore,
      'winner': this.winner,
  }))
  }

  handleKeyUpOnline(event) {
    let paddle = this.players.get("" + window.user.id);
    let action = this.events.getKeyPress(paddle.moveUpKey) ? "up" : this.events.getKeyPress(paddle.moveDownKey) ? "down": this.events.getKeyPress(" ") ? "pause" :undefined;
    if (action != undefined)
      if (action == "pause") {
        this.togglePause();
        return ;
      }
      if (!this.pause) {
        this.socket.send(JSON.stringify({
          'type': 'move',
          'action': action,
          'playerId': window.user.id
        }));
      }
  }


  updateEvents()
  {
    this.handleKeyUpOnline();
  }

  draw() {
    this.fps++;
    this.updateEvents();
    if (!this.pause && !this.finish && !this.winner) {
      this.update();
      this.context.clearRect(0, 0, this.canvas.width,this.canvas.height);
      this.objects.forEach((element) => {
        element.draw(this.context);
      });
     }else if (this.winner && !this.finish) {
      if (this.pause) { //reset canvas so that game over doesnt display over the paused
        this.pause = false;
        this.context.clearRect(0, 0, this.canvas.width,this.canvas.height);
        this.objects.forEach((element) => {
          element.draw(this.context);
        });
      }
      this.finish = true;
      this.displayGameOver();
    }
    else if(this.pause){
      this.displayPaused();
    }
  }

  displayGameOver() {
    for (let i = 0; i < 15; i++) {
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
      if (this.winner != "disconnect")
        this.context.fillText(`Player ${this.players.get(this.winner).displayName} wins`, this.canvas.width / 2 - 100, this.canvas.height / 2 + 50);
      else
        this.context.fillText(`Player disconnected`, this.canvas.width / 2 - 100, this.canvas.height / 2 + 50);
      this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
    }

    setTimeout( async () => {
      if (views.props.type == 'online' && this.playerHost == window.user.id)
        await this.sendGameOver();
    }, 3500);
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





  handlePlayerMove(data) {   
  //   console.log(typeof(data.playerId));
    let paddle = this.players.get("" + data.playerId);
    // console.log("paddle: ", paddle);    
    // console.table(data);
    if (data.move === "up") {
      paddle.moveUp = false;
      paddle.moveDown = true;
    }
    else if (data.move === 'down') {
      paddle.moveUp = true;
      paddle.moveDown = false;
    }
    paddle.move();
  }

  destroyer() {
    // console.log("destryoing game");
    this.events.destroyer();
    window.removeEventListener('resize', this.resizeCanvasEvent);
    clearInterval(this.gameLoop);
  }
}



const  initializeWebSocket = (id, playerId) =>
{
  socketGame = new WebSocket(
    `wss://${window.location.host}/wss/game/${id}/`
  );

  // console.log("socket == ", socketGame);

  socketGame.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        
        // console.log("dta socket == ", data);
        if (data.type == "error") {
          console.log("resting you home, can't join that game");
          views.urlLoad("/home");
        }
        if (gameData.game && window.user.id != gameData.game.playerHost)
        {
          // console.log("action ==> ", action);
          if (data.action === 'ball') {
            // console.log("ball action = ", data.action);
            gameData.game.ball.setPostion(data.x, data.y, data.visibility);
          }
          else if (data.action === "candy")
            // console.log("candy action = ", data.action);
            gameData.game.setCandy(data);
          else if (data.type == 'move') 
            gameData.game.handlePlayerMove(data);
          else if (data.action == 'candy_powerup') 
            gameData.game.activateCandy(data);
          else if (data.action == 'score_update') {
            gameData.game.score.set(data.display_name, data.score);
            atualizeScore(gameData.game)
          }
          else if (data.action == 'pause_game')
          {
            gameData.game.pause = data.flag;
          }
          else if (data.action == "game_end")
          {
            views.urlLoad("/home");
          }
          else if (data.action == "disconnect")
          {
            console.log(data.playerId, "disconnected");
            gameData.game.disconnect(data.playerId);
          }
          // else
          //   console.log("action unkown =", data.action);
        }
        else if (data.action === 'running' && gameData.game == undefined)
        {    
          console.log("data == ", data);

          const row = document.getElementById("game");
          row.style.display = "flex";
          const matchmaking = document.getElementById("matchmaking");
          matchmaking.style.display = "none";

          const data2  = {}

          for (let i = 0; i < data.players.length; i++) {
            data2["" + data.players[i]] = [
              window.user.up_key,
              window.user.down_key,
              data.players_displays[i],
              data.players[i]
            ]
          }
            console.log("data2 == ", data2);
            gameData.game = new Game(data.players.length, data2, data.playerHost);
            gameData.game.socket = socketGame;
            gameData.game.pause = false;
            gameData.game.setupGame(data2);
        }
        else if (data.type == 'move') 
          gameData.game.handlePlayerMove(data);
        else if (data.action == "game_end")
        {
          views.urlLoad("/home");
        }
        else if (data.action == 'pause_game')
        {
          // console.log("received pause flag =", data.flag);
          gameData.game.pause = data.flag;
        }
        else if (data.action == "disconnect")
        {
          console.log(data.playerId, "disconnected");
          gameData.game.disconnect(data.playerId);
        }
        // else
        //   console.log("action unkown =", data.action);
      } catch {
        
      }
  }

  socketGame.onclose = (e) => {
    console.error('Socket closed unexpectedly');
  }

  // const s = socketGame;

  // Enviar uma mensagem
  socketGame.onopen = () =>  {
    socketGame.send(JSON.stringify({
      'playerId': playerId,
      'action': 'join'
    }));
  };

  return socketGame;
}

views.setElement('/game', (state) => {
  // const data = {
  //   "35": [
  //     "w",
  //     "s"
  //   ],
  //   "2": [
  //     "w",
  //     "s"
  //   ]
  // }
  if (state == "block")
  { 
    if (views.props.type == 'online' && socketGame == undefined)
      socketGame =  initializeWebSocket(views.props.id, window.user.id);
    else if (views.props.type != 'online') {
      const matchmaking = document.getElementById("matchmaking");
      matchmaking.style.display = "none";
      const row = document.getElementById("game");
      row.style.display = "flex";
    }
  }
  // console.log("game: ", data)
  // if (state == "block")
  //   game = new Game(2, data);
  else
  {
    const row = document.getElementById("game");
    row.style.display = "none";
    const matchmaking = document.getElementById("matchmaking");
    matchmaking.style.display = "block";
    // if (gameData.game?.winner == undefined)
    //   gameData.game.disconnecting();
    gameData.game?.destroyer();
    gameData.game = undefined;
    if (socketGame.readyState === WebSocket.OPEN || socketGame.readyState === WebSocket.CONNECTING)
      socketGame.close();
    socketGame =  undefined;
  } 
  views.get("/footer").display(state);
	views.get("/navbar").display(state);
})
.setChilds(["/navbar", "/footer"])
.setEvents();


