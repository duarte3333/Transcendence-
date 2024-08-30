import { views } from "../../main/js/main.js";
import { checkCandies } from "./candy.js";
import { bounceWalls } from "./map.js";
import { bouncePlayers, checkPlayers } from "./paddles.js";


// Ball object
export class Ball {
    x;
    y;
    radius;
    speedX;
    speedY;
    speed;
    speedLimit;
    color;
    name; 
    last_hit;
    last_hitBK;
    visible;
    touches;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.radius = 10;
        this.speedX = -1;
        this.speedY = 0;
        this.speed = 2.5;
        this.speedLimit = 20;
        this.color = "black";
        this.name = "ball"; 
        this.last_hit = "";
        this.last_hitBK = "";
        this.visible = true;
        this.touches = 0;
    }

    move(game) {
        if (this.speed > this.speedLimit)
            this.speed = this.speedLimit;
        let map = game.objects.get("map");
        for (let i = 1; i <= this.speed; i++) {
            let futureX = this.x + this.speedX;
            let futureY = this.y + this.speedY;
            let {edge: edge, temp: player} = checkPlayers(futureX, futureY, this.radius, game);
            if (edge && player) {
                bouncePlayers(this, edge, player);
                this.touches = 0;
            }
            edge = map.checkWalls(this.x, this.y, this.radius);
            if (edge && edge.class == "wall") {
                this.touches++;
                bounceWalls(this, edge);
                if (this.touches && this.touches % 2) {
                    this.speed++;
                    //PROTECTION FROM INFINITE LOOP
                    if (this.touches > 4) {
                        let angle = Math.atan2(this.speedX, this.speedY);
                        angle *= 1.01;
                        if (angle > 2 * Math.PI) {
                            angle -= 2 * Math.PI;
                        }
                        this.speedY = Math.sin(angle);
                        this.speedX = Math.cos(angle);
                        this.touches = 0;
                    }
                }
            }
            else if (edge && edge.class == "goal") {
                this.goal(edge, game.speed, game);
            }
            this.x += this.speedX;
            this.y += this.speedY;
            checkCandies(this, game);
            edge = null;
        }
        if (views.props.type == "online")
        { 
            game.socket.send(JSON.stringify({
                'type': 'ball_move',
                'action': 'ball',
                'x': this.x,
                'y': this.y,
                'visibility': this.visible,
            }))
        }
    }

    setPostion(x, y, visibility){
        this.x = x;
        this.y = y;
        this.visible = visibility;
        // console.log("ball: x: " + this.x + " y: " + this.y + " visibilty: " + visibility);
    }

    draw(context) {
        if (this.visible) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
        }
    }

    goal(edge, gameSpeed, game) {
        if (edge.goalKeeper != this.last_hit && this.last_hit)
            game.updateScore(this.last_hit, 1);
        else if (this.last_hitBK)
            game.updateScore(this.last_hitBK, 1);
        else
            game.updateScore(edge.goalKeeper, 0);
        this.restartBall(gameSpeed);
        this.last_hit = 0;
        this.last_hitBK = 0;
    }

    restartBall(gameSpeed) {
        const canvas = document.getElementById("pongCanvas");
        this.touches = 0;
        this.visible = false;
        this.x = canvas.width / 2; 
        this.y = canvas.height / 2;
        this.speed = 0;
        setTimeout(() => {
            this.visible = true;
            this.speed = 2 * gameSpeed;
        }, 700);
    }

    updateLastHit(name) {
        if (this.last_hit != name) {
            this.last_hitBK = this.last_hit;
            this.last_hit = name;
        }
    }
  }