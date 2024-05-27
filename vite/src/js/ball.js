import { bounceWalls } from "./map.js";
import { bouncePlayers, checkPlayers } from "./paddles.js";

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

    move: function (game) {
        let map = game.objects.get("map");
        for (let i = 1; i <= this.speed; i++) {
            ball.x += ball.speedX;
            ball.y += ball.speedY;
            let edge = checkPlayers(ball, game)
            if (edge)
                bouncePlayers(ball, edge);
            edge = map.checkWalls(ball.x, ball.y, ball.radius);
            if (edge)
                bounceWalls(ball, edge);
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