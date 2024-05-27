import { bounceWalls } from "./map.js";
import { checkPlayers } from "./game.js";
import { bouncePlayers } from "./game.js";

// Ball object
export const ball = {
    x: 0,
    y: 0,
    radius: 10,
    speedX: 1,
    speedY: 0,
    speed: 2,
    speedLimit: 20,
    color: "black",
    name: "ball", 
    last_hit: "player_1",

    move: function (map) {
        for (let i = 1; i <= this.speed; i++) {
            ball.x += ball.speedX;
            ball.y += ball.speedY;
            // if (checkPlayers(ball.x, ball.y, ball. radius))
            //     bouncePlayers(ball);
            if (map.checkWalls(ball.x, ball.y, ball.radius))
                bounceWalls(ball, map);
        }
    },

    draw: function (context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    },
  };