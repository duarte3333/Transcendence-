const canvas = document.getElementById("pongCanvas");

import { ball } from "./ball.js";
import { playerPaddle } from "./paddles.js";
import { aiPaddle } from "./paddles.js";
import { candy } from "./candy.js";
import { events } from "./events.js";
import { Score } from "./score.js";
import { isRectCircleCollision } from "./aux.js";

class Game {
  
  objects = new Map();
  pause = false;
  speed = 2.5;
  score = new Score()
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
        object.x = x; object.y = y;
      }
    } 
    else {
      object.x = x; object.y = y;
    }
  }

  check_ball_walls_collision() {
    const ball = this.objects.get("ball");
    if (ball.y - ball.radius <= 0) {
      ball.speedY = -ball.speedY;
      ball.y += 1;
    }
    if (ball.y + ball.radius >= canvas.height) {
      ball.speedY = -ball.speedY;
      ball.y -= 1;
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
    this.move("ball", ball.x + ball.speedX, ball.y + ball.speedY);

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


    if (ball.x + ball.radius > canvas.width) {
      player_1.score.addScore();
      this.resartBall();
      console.log("Player 1 wins");
      // ball.speedY /= 2;
      // ball.speedX /= 2;
      // setTimeout(function() {
      //   ball.speedY *= 2;
      //   ball.speedX *= 2;
      // }, 1400);
    }

    if (ball.x - ball.radius < 0) {
      console.log();
      player_2.score.addScore();
      this.resartBall();
      ball.speedX *= -1;
      console.log("Player 2 wins");
      // ball.speedY /= 2;
      // ball.speedX /= 2;
      // setTimeout(function() {
      //   ball.speedY *= 2;
      //   ball.speedX *= 2;
      // }, 1400);
    }

    if (candy.visible && isRectCircleCollision(ball, candy)) {
      console.log("Candy collected");
      console.log(ball.last_hit);
      console.log(player_1.name);
      if (ball.last_hit == player_1.name) {
        player_2.height *= 0.8;
        player_1.height *= 1.2;
      }
      if (ball.last_hit == player_2.name) {
        player_1.height *= 0.8;
        player_2.height *= 1.2;
      }
      candy.visible = false;
      candy.reset(canvas.width, canvas.height, 50, player_1, player_2);
    }
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
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.objects.forEach((element) => {
        element.draw(this.context);
      });
      this.score.showScore(this.objects, this.context, canvas);
    } 
    else {
      this.context.font = "30px Verdana, sans-serif";
      this.context.fillStyle = "white";
      this.context.fillText("Paused", canvas.width / 2 - 50, canvas.height / 2);
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