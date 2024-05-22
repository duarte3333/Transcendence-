const canvas = document.getElementById("pongCanvas");

import { ball } from "./ball.js";
import { playerPaddle } from "./paddles.js";
import { aiPaddle } from "./paddles.js";
import { Candy } from "./candy.js";
import { events } from "./events.js";
import { Score } from "./score.js";
import { isRectCircleCollision } from "./aux.js";
import { bounce } from "./map.js";
import { map } from "./map.js";




class Game {
  
  objects = new Map();
  numberOfPlayers = 10;
  pause = false;
  speed = 2.5;
  isScoring = false;
  score = new Score()
  events = new events(this);  // Initialize events after setting up game
  candies = [];

  //INITIALIZE GAME
  constructor() {
    this.context = canvas.getContext("2d");
    document.addEventListener('DOMContentLoaded', () => {
      const canvas = document.getElementById("pongCanvas");
      this.context = canvas.getContext("2d");
      this.setupGame();  // Initialize game after setting context
    });
  }

  updateScore() {
    const player1ScoreElem = document.getElementById('playerScore1');
    const player2ScoreElem = document.getElementById('playerScore2');
    player1ScoreElem.textContent = this.objects.get("player_1").score.value;
    player2ScoreElem.textContent = this.objects.get("player_2").score.value;
  }


  setupGame() {
    this.addMap(map);
    this.addPlayer(playerPaddle);
    this.addPlayer(aiPaddle);
    this.addBall(ball);
    this.addCandies(2);
    this.init(); 
  } 

  init() {
    setInterval(this.draw.bind(this), 1000 / 60);
    console.log("Game initialized");
  }

  //ADD OBJECTS TO GAME
  addMap(map) {
    map.img.src = "../img/lisboa3.png";
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


  addPlayer(paddle) {
    if (paddle.name === "player_1") paddle.x = 0;
    else paddle.x = canvas.width - paddle.width;
    paddle.y = canvas.height / 2 - 50;
    paddle.speed *= this.speed;
    paddle.draw(this.context);
    this.objects.set(paddle.name, paddle);
  }

  addBall(ball) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedY *= this.speed;
    ball.speedX *= this.speed;
    ball.draw(this.context);
    this.objects.set(ball.name, ball);
  }

  addCandies(numCandies) {
    for (let i = 0; i < numCandies; i++) {
      const candy = new Candy(canvas.width, canvas.height, 50);
      this.candies.push(candy);
      this.objects.set(`candy_${i}`, candy);
    }
  }

  //MOVE OBJECTS
  move(name, x, y) {
    const object = this.objects.get(name);
    if (object.name === "player_1" || object.name === "player_2") {
      if (y < 0 || y + object.height > canvas.height) return;
      else {
        object.x = x; object.y = y;
      }
    } 
    else {
      object.x = x; object.y = y;
    }
  }

  check_ball_walls_collision() {
    const ball = this.objects.get("ball");
    const map = this.objects.get("map");
    // if ((ball.y - ball.radius <= 0)) {
    //   ball.speedY = -ball.speedY;
    //   ball.y += 1;
    // }
    // if (ball.y + ball.radius >= canvas.height) {
    //   ball.speedY = -ball.speedY;
    //   ball.y -= 1;
    // }
    if (map.checkWalls(ball.x, ball.y, ball.radius)) { //if the ball hits the walls
      // document.getElementById("pongCanvas").style.backgroundColor = "green";
      // console.log("hit!");
      bounce(ball, map);
    }
  }

  //UPDATE OBJECTS
  update() {
    const playerPaddle = this.objects.get("player_1");
    const aiPaddle = this.objects.get("player_2");

    //Update players paddle and ball
    if (playerPaddle.moveUp) {
      this.move("player_1", playerPaddle.x, playerPaddle.y - playerPaddle.speed);
    } else if (playerPaddle.moveDown) {
      this.move("player_1", playerPaddle.x, playerPaddle.y + playerPaddle.speed);
    }
    this.move("ball", ball.x + ball.speedX, ball.y + ball.speedY); //replace with movefor the ball

    this.check_ball_walls_collision();
    this.collisionDetection();
    this.updateAI();
  }

  updateAI() {
    const player_2 = this.objects.get("player_2") || this.objects.get("ai");
    if (player_2.name === "ai") {
      // AI paddle follows the ball
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
    } 
    //Manual player_2
    else if (player_2.name === "player_2") {
      if (aiPaddle.moveUp) {
        this.move("player_2", aiPaddle.x, aiPaddle.y - aiPaddle.speed);
      } else if (aiPaddle.moveDown) {
        this.move("player_2", aiPaddle.x, aiPaddle.y + aiPaddle.speed);
      }
    }
  }

  restartBall() {
    //wait for 1 second before restarting the ball
    const ball = this.objects.get("ball");
    ball.x = canvas.width / 2; 
    ball.y = canvas.height / 2;
    ball.speedX = 4 * this.speed;
    ball.speedY = 0 * this.speed;
  }

  collisionDetection() {
    const ball = this.objects.get("ball");
    const player_1 = this.objects.get("player_1");
    const player_2 = this.objects.get("player_2");
    if (isRectCircleCollision(ball, player_1)
  ) {
      ball.last_hit = player_1.name;
      // Calculate impact point -> a value between -1 and 1
      let impactPoint =
      (ball.y - (playerPaddle.y + playerPaddle.height / 2)) /
      (playerPaddle.height / 2);
  
      // Modify speed based on where it hit the paddle
      ball.speedY = impactPoint * (5 * this.speed); // The '5' factor controls the influence
      ball.speedX = -ball.speedX;
    }

    if (isRectCircleCollision(ball, player_2) 
    ) {
      ball.last_hit = player_2.name;
      let impactPoint =
      (ball.y - (aiPaddle.y + aiPaddle.height / 2)) / (aiPaddle.height / 2);
      ball.speedY = impactPoint * (5 * this.speed); // Adjust '5' as needed
      ball.speedX = -ball.speedX;
    }


    if (ball.x > canvas.width || ball.x < 0 || ball.y > canvas.height || ball.y < 0) {
      this.restartBall();
    }

    // if (ball.x + ball.radius > canvas.width && !this.isScoring) {
    //   this.isScoring = true;
    //   player_1.score.addScore();
    //   this.updateScore();
    //   setTimeout(() => {
    //     this.restartBall();
    //     console.log("Player 1 wins");
    //     this.isScoring = false;
    //   }, 1000);
    // }
    
    // if (ball.x - ball.radius < 0 && !this.isScoring) {
    //   this.isScoring = true;
    //   player_2.score.addScore();
    //   this.updateScore();
    //   setTimeout(() => {
    //     this.restartBall();
    //     console.log("Player 2 wins");
    //     this.isScoring = false;
    //   }, 1000);
    // }
    

    this.candies.forEach(candy => {
      if (candy.visible && isRectCircleCollision(ball, candy)) {
        console.log("Candy collected by " + ball.last_hit);
        if (ball.last_hit === player_1.name) {
          player_2.height *= 0.8;
          player_1.height *= 1.2;
        } else if (ball.last_hit === player_2.name) {
          player_1.height *= 0.8;
          player_2.height *= 1.2;
        }
        candy.visible = false;
        candy.reset(canvas.width, canvas.height, player_1, player_2);
      }
    });
  }

  tooglePause() {
    this.pause = !this.pause;
  }

  draw() {
    if (!this.pause) {
      this.update();
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.objects.forEach((element) => {
        console.log("drawing :" + element.name);
        element.draw(this.context);
      });
    } 
    else {
      this.context.font = "bold 40px Poppins, sans-serif";
      this.context.fillStyle = "black";
      this.context.shadowColor = "rgba(0, 0, 0, 0.5)"; 
      this.context.shadowOffsetX = 1; this.context.shadowOffsetY = 1; this.context.shadowBlur = 1;
      var gradient = this.context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop("0", "white"); gradient.addColorStop("1", "#759ad7"); // light blue
      this.context.fillStyle = gradient;
      this.context.fillText("Paused", canvas.width / 2 - 75, canvas.height / 2);
      this.context.shadowOffsetX = 0; this.context.shadowOffsetY = 0; this.context.shadowBlur = 0;
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

// window.addEventListener('resize', resizeCanvas, false);

// function resizeCanvas() {
//     var canvas = document.getElementById('pongCanvas');
//     var widthToHeight = 5 / 3; // replace with your desired aspect ratio
//     var newWidth = canvas.offsetWidth;
//     var newHeight = newWidth / widthToHeight;

//     canvas.width = newWidth;
//     canvas.height = newHeight;
// }

// resizeCanvas(); // call the function initially when the page loads
 
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


//Adicionar mais candies e de differentes tipos
//Meter botao login e logout
//Meter botao de registo
//Meter selecao unica de display name e email
//Meter botao de play 
//Fazer cenario de resart do game
//Meter upload de imagem para avatar e ter uma default option
//Meter seccao dos gajos online e seccao para adicionar amigos
//Local com as estatisticas
//Meter match history
//Multiplayers até n jogadores
//Zona de customizacao: powerups, skins, attacks, different maps
//Change theme
//Interface for changing game parameters
//Game Stats Dashboard