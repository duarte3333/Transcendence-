import { Score } from "./score.js";

export const playerPaddle = {
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

    draw: function (context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    },
  };


export const aiPaddle = {
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

    draw: function (context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    },
  };