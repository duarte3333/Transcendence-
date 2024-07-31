import { bounceWalls } from "./map.js";
import { bouncePlayers, checkPlayers } from "./paddles.js";
import { updateScore } from "./score.js";


// Ball object
export const ball = {
    x: 0,
    y: 0,
    radius: 10,
    speedX: 1,
    speedY: 0,
    speed: 2,
    speedLimit: 12,
    color: "black",
    name: "ball", 
    last_hit: "",
    last_hitBK: "",

    move: function (game) {
        if (this.speed > this.speedLimit)
                this.speed = this.speedLimit;
        let map = game.objects.get("map");
        for (let i = 1; i <= this.speed; i++) {
            ball.x += ball.speedX;
            ball.y += ball.speedY;
            let {edge: edge, temp: player} = checkPlayers(ball, game)
            if (edge && player)
                bouncePlayers(ball, edge, player);
            edge = map.checkWalls(ball.x, ball.y, ball.radius);
            if (edge && edge.class == "wall")
                bounceWalls(ball, edge);
            else if (edge && edge.class == "goal")
                this.goal(edge);
        }
    },

    draw: function (context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    },
    goal: function (edge) {
        if (edge.goalKeeper != this.last_hit && this.last_hit)
            updateScore(this.last_hit);
        else if (this.last_hitBK)
            updateScore(this.last_hitBK);
        this.restartBall();
    },

    restartBall: function () {
        const canvas = document.getElementById("pongCanvas");
        this.x = canvas.width / 2; 
        this.y = canvas.height / 2;
    },

    updateLastHit: function (name) {
        if (this.last_hit != name) {
            this.last_hitBK = this.last_hit;
            this.last_hit = name;
        }
    },
  };