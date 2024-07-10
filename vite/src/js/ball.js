import { checkCandies } from "./candy.js";
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
    visible: true,
    touches: 0,

    move: function (game) {
        if (this.speed > this.speedLimit)
            this.speed = this.speedLimit;
        console.log(`speed = ${this.speed}, vx = ${this.speedX}, vy = ${this.speedY}`);
        let map = game.objects.get("map");
        for (let i = 1; i <= this.speed; i++) {
            let futureX = ball.x + ball.speedX;
            let futureY = ball.y + ball.speedY;
            let {edge: edge, temp: player} = checkPlayers(futureX, futureY, ball.radius, game);
            if (edge && player) {
                bouncePlayers(ball, edge, player);
                this.touches = 0;
            }
            edge = map.checkWalls(ball.x, ball.y, ball.radius);
            if (edge && edge.class == "wall") {
                this.touches++;
                console.log(`wall hit: ${edge.name}`);
                bounceWalls(ball, edge);
                if (this.touches % 2) {
                    this.speed++;
                    if (this.touches > 2) {
                        let angle = Math.atan2(this.speedX, this.speedY);
                        angle += 5;
                        if (angle > 360) {
                            angle -= 360;
                        }

                        this.speedY = Math.sin(angle);
                        this.speedX = Math.cos(angle);
                    }
                }
            }
            else if (edge && edge.class == "goal") {
                this.goal(edge, game.speed);
            }
            ball.x += ball.speedX;
            ball.y += ball.speedY;
            checkCandies(ball, game);
            edge = null;
        }
    },

    draw: function (context) {
        if (this.visible) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
        }
    },

    goal: function (edge, gameSpeed) {
        if (edge.goalKeeper != this.last_hit && this.last_hit)
            updateScore(this.last_hit, 1);
        else if (this.last_hitBK)
            updateScore(this.last_hitBK, 1);
        else
            updateScore(edge.goalKeeper, 0);
        this.restartBall(gameSpeed);
        this.last_hit = 0;
        this.last_hitBK = 0;
    },

    restartBall: function (gameSpeed) {
        console.log("restarting ball");
        const canvas = document.getElementById("pongCanvas");
        this.visible = false;
        this.x = canvas.width / 2; 
        this.y = canvas.height / 2;
        this.speed = 0;
        setTimeout(() => {
            this.visible = true;
            this.speed = 2 * gameSpeed;
        }, 700);
    },

    updateLastHit: function (name) {
        if (this.last_hit != name) {
            this.last_hitBK = this.last_hit;
            this.last_hit = name;
        }
    },
  };