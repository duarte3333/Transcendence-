import { Score } from "./score.js";

const canvas = document.getElementById("pongCanvas");

// Ball object
const ball = {
  x: 0,
  y: 0,
  radius: 10,
  speedX: 4,
  speedY: 0,
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
  moveUp: false,
  moveDown: false,
  lastHit: false,
  speed: 3,
  score: new Score(),
};

const aiPaddle = {
  width: 10,
  height: 100,
  x: 0,
  y: 0,
  name: "player_2",
  color: "white",
  lastHit: false,
  moveUp: false,
  moveDown: false,
  speed: 3,
  score: new Score(),
};

const candy = {
  width: 30,
  height: 30,
  x: Math.random() * (canvas.width - 2 * 50) + 50,
  y: Math.random() * (canvas.height - 2 * 50) + 50,
  visible: true, // Visibility controlled for spawn timing
  name: "candy",
  color: "blue",
  reset: function(canvasWidth, canvasHeight, padding) {
    // Random position not too close to the walls
    this.x = Math.random() * (canvasWidth - 2 * padding) + padding;
    this.y = Math.random() * (canvasHeight - 2 * padding) + padding;
  },
  ballCollidesWithCandy: function(obj2, obj) {
    return obj2.x + obj2.radius > obj.x &&
      obj2.x - obj2.radius < obj.x + obj.width &&
      obj2.y + obj2.radius > obj.y &&
      obj2.y - obj2.radius < obj.y + obj.height;
  }
};


class Game {
  objects = new Map();
  pause = false;
  speed = 2.5;

  constructor() {
    this.context = canvas.getContext("2d");
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
    else paddle.x = canvas.width - paddle.width;

    paddle.y = canvas.height / 2 - 50;
    paddle.speed *= this.speed;
    this.objects.set(paddle.name, paddle);
  }

  addBall(ball) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.draw = () => {
      this.context.fillStyle = ball.color;
      this.context.beginPath();
      this.context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
      this.context.closePath();
      this.context.fill();
    };
    ball.speedY *= this.speed;
    ball.speedX *= this.speed;
    this.objects.set(ball.name, ball);
  }

  addCandy(candy) {
    candy.draw = () => {
      if (candy.visible) {
        this.context.fillStyle = candy.color;
        this.context.fillRect(candy.x, candy.y, candy.width, candy.height);
      }
    };
    this.objects.set(candy.name, candy);
  }

  move(name, x, y) {
    const object = this.objects.get(name);
    if (object.name === "player_1" || object.name === "player_2") {
      if (y < 0 || y + object.height > canvas.height) return;
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

    //update players paddle
    if (playerPaddle.moveUp) {
      this.move(
        "player_1",
        playerPaddle.x,
        playerPaddle.y - playerPaddle.speed
      );
    } else if (playerPaddle.moveDown) {
      this.move(
        "player_1",
        playerPaddle.x,
        playerPaddle.y + playerPaddle.speed
      );
    }

    // Update the ball's position
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Check for collision with the top and bottom walls
    if (ball.y - ball.radius <= 0) {
      ball.speedY = -ball.speedY;
      ball.y += 1;
    }
    if (ball.y + ball.radius >= canvas.height) {
      ball.speedY = -ball.speedY;
      ball.y -= 1;
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
      ball.speedY = impactPoint * (5 * this.speed); // The '5' factor controls the influence
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

      ball.speedY = impactPoint * (5 * this.speed); // Adjust '5' as needed
      ball.speedX = -ball.speedX;
    }
    this.collisionDetection();
  }

  updateAI() {
    // if (canvas.height - ball.y > 50 && canvas.width - ball.x > 50)
    // {
    const player_2 = this.objects.get("player_2") || this.objects.get("ai");
    if (player_2.name === "ai") {
      if (ball.y < aiPaddle.y + aiPaddle.height / 2 - 10) {
        this.move("player_2", aiPaddle.x, aiPaddle.y - aiPaddle.speed); // Move paddle up
      } else if (ball.y > aiPaddle.y + aiPaddle.height / 2 + 10) {
        this.move("player_2", aiPaddle.x, aiPaddle.y + aiPaddle.speed); // Move paddle down
      }
      // }

      // Introduce error sometimes
      // if (Math.random() < 0.10) { // 10% chance to make a mistake
      //     // Mistake is moving in the opposite direction
      //     if (Math.random() < 0.5) {
      //         aiPaddle.y += 5; // Move incorrectly down
      //     } else {
      //         aiPaddle.y -= 5; // Move incorrectly up
      //     }
      // }

      // Ensure AI paddle doesn't move out of canvas bounds
      if (aiPaddle.y < 0) {
        aiPaddle.y = 0;
      } else if (aiPaddle.y + aiPaddle.height > canvas.height) {
        aiPaddle.y = canvas.height - aiPaddle.height;
      }
    } else if (player_2.name === "player_2") {
      //update players paddle
      if (aiPaddle.moveUp) {
        this.move(
          "player_2",
          aiPaddle.x,
          aiPaddle.y - aiPaddle.speed
        );
      } else if (aiPaddle.moveDown) {
        this.move(
          "player_2",
          aiPaddle.x,
          aiPaddle.y + aiPaddle.speed
        );
      }
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
      player_2.lastHit = true;
      player_1.lastHit = false;
    }

    if (
      ball.x - ball.radius < player_1.x + player_1.width &&
      ball.y > player_1.y &&
      ball.y < player_1.y + player_1.height
    ) {
      ball.speedX = -ball.speedX;
      player_1.lastHit = true;
      player_2.lastHit = false;
    }

    if (ball.x + ball.radius > canvas.width) {
      player_1.score.addScore();
      this.resartBall();
      console.log("Player 1 wins");
      ball.speedY /= 2;
      ball.speedX /= 2;
      setTimeout(function() {
        ball.speedY *= 2;
      ball.speedX *= 2;
    }, 1400);
    console.log("End");
    }

    if (ball.x - ball.radius < 0) {
      console.log();
      player_2.score.addScore();
      this.resartBall();
      ball.speedX *= -1;
      console.log("Player 2 wins");
      ball.speedY /= 2;
      ball.speedX /= 2;
      setTimeout(function() {
        ball.speedY *= 2;
      ball.speedX *= 2;
    }, 1400);
    }

    if (candy.visible && candy.ballCollidesWithCandy(ball, candy)) {
      console.log("Candy collected");
      if (player_1.lastHit) player_2.height *= 0.9; player_1.height *= 1.1;
      if (player_2.lastHit) player_1.height *= 0.9; player_2.height *= 1.1;
      candy.visible = false;
      candy.reset(canvas.width, canvas.height, 50);
    }
  }

  

  showScore() {
    const player_1 = this.objects.get("player_1");
    const player_2 = this.objects.get("player_2");
    this.context.font = "25px Verdana, sans-serif";
    this.context.fillText(player_1.score.getScore(), canvas.width / 4, 50);
    this.context.fillText(
      player_2.score.getScore(),
      (canvas.width / 4) * 3,
      50
    );
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
      this.updateAI();
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.objects.forEach((element) => {
        element.draw();
      });
      this.showScore();
    } else {
      //Do that background more transparent when hit pause button
      this.context.font = "30px Verdana, sans-serif";
      this.context.fillText(
        "Paused",
        canvas.width / 2 - 50,
        canvas.height / 2
      );
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

//PLAYER 1 moves
document.addEventListener("keydown", (event) => {
  const playerPaddle = game.objects.get("player_1");
  if (event.key === "w") {
    event.preventDefault();
    playerPaddle.moveUp = true;
  }
  if (event.key === "s") {
    event.preventDefault();
    playerPaddle.moveDown = true;
  }
  if (event.key === " ") {
    event.preventDefault();
    console.log("Space");
    game.tooglePause();
  }
});

document.addEventListener("keyup", (event) => {
  const playerPaddle = game.objects.get("player_1");
  if (event.key === "w") {
    event.preventDefault();
    playerPaddle.moveUp = false;
  }
  if (event.key === "s") {
    event.preventDefault();
    playerPaddle.moveDown = false;
  }
});

//PLAYER 2 moves
document.addEventListener("keydown", (event) => {
  const playerPaddle_2 = game.objects.get("player_2");
  if (event.key === "ArrowUp") {
    event.preventDefault();
    playerPaddle_2.moveUp = true;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    playerPaddle_2.moveDown = true;
  }
});

document.addEventListener("keyup", (event) => {
  const playerPaddle = game.objects.get("player_2");
  if (event.key === "ArrowUp") {
    event.preventDefault();
    playerPaddle.moveUp = false;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    playerPaddle.moveDown = false;
  }
});

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

document.addEventListener("DOMContentLoaded", (event) => {
  game.addPlayer(playerPaddle);
  game.addPlayer(aiPaddle);
  game.addCandy(candy);
  game.addBall(ball);
  game.init();
});

//SPEED BUTTON
document.addEventListener('DOMContentLoaded', function () {
  var speedControl = document.getElementById('speedControl');
  speedControl.addEventListener('change', function() {
      var newSpeed = this.value;
      console.log("Speed changed to: " + newSpeed);
      game.updateGameSpeed(newSpeed);
  });
});

//Ai BUTTON
document.addEventListener('DOMContentLoaded', function () {
  var aiButton = document.getElementById('AiButton');
  var playerButton = document.getElementById('PlayerButton');
  const playerPaddle_2 = game.objects.get("player_2") || game.objects.get("ai");
  aiButton.addEventListener('click', () => {
    playerPaddle_2.name = "ai";
    aiButton.className = "btn btn-dark";
    console.log(aiButton);
    playerButton.className = "btn btn-light";
  });
  playerButton.addEventListener('click', () =>{
    playerPaddle_2.name = "player_2";
    aiButton.className = "btn btn-light";
    playerButton.className = "btn btn-dark";
  });
});

