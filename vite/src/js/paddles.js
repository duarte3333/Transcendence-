import { Score } from "./score.js";
import {Edge} from "./map.js";

export class Paddle {
  name;
  type;
  width;
  height;
  x;
  y;
  vx;
  vy;
  angle;
  edge;
  speed;
  score;
  moveDown;
  moveUp;
  moveUpKey;
  moveDownKey
  color;

  constructor(map, index) {
    this.name = "paddle_" + index;
    this.type = "player";
    this.speed = 3;
    this.moveDown = false;
    this.moveUp = false;
    this.score = new Score();
    this.color = "black";
    const edgeKey = "edge_" + (index * 2);
    this.edge = map.polygon.get(edgeKey);
    if (!this.edge) {
      console.error(`Edge with key ${edgeKey} not found in map.polygon`);
      return;
    }
    this.x = this.edge.x1;
    this.y = this.edge.y1;
    this.angle = this.edge.angle;
    this.vx = Math.cos(this.angle);
    this.vy = Math.sin(this.angle);
    this.height = this.edge.size / 5;
    this.width = this.height / 8;
    this.moveUpKey = "w";
    this.moveDownKey = "s";
  }

  print() {
    console.log(`----${this.name}----`);
    console.log(`type = ${this.type}`);
    console.log(`width = ${this.width}`);
    console.log(`height = ${this.height}`);
    console.log(`x = ${this.x}`);
    console.log(`y = ${this.y}`);
    console.log(`vx = ${this.vx}`);
    console.log(`vy = ${this.vy}`);
    console.log(`angle = ${this.angle}`);
    this.edge.print();
    console.log(`speed = ${this.speed}`);
    console.log(`moveDown = ${this.moveDown}`);
    console.log(`moveUp = ${this.moveUp}`);
    console.log(`color = ${this.color}`);
  }

  draw(context) {
    let x = this.x; let y = this.y;
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(x, y);

    x = x + this.width * Math.cos(this.edge.perpAngle);
    y = y + this.width * Math.sin(this.edge.perpAngle);
    context.lineTo(x, y);

    x = x - this.height * Math.cos(this.edge.perpAngle + Math.PI * 0.5);
    y = y - this.height * Math.sin(this.edge.perpAngle + Math.PI * 0.5);
    context.lineTo(x, y);

    x = x + this.width * Math.cos(this.edge.perpAngle + Math.PI * 1);
    y = y + this.width * Math.sin(this.edge.perpAngle + Math.PI * 1);
    context.lineTo(x, y);

    x = x - this.height * Math.cos(this.edge.perpAngle + Math.PI * 1.5);
    y = y - this.height * Math.sin(this.edge.perpAngle + Math.PI * 1.5);
    context.lineTo(x, y);

    context.closePath();
    context.fill();
  }
  //NOT WORKING
  move() {
    if (this.moveUp) {
      if (this.name == "paddle_3")
        console.log(`moving up  start x = ${this.x}, y = ${this.y}`);
      for (let i = 1; i <= this.speed; i++) {
        let newX = this.x + this.vx;
        let newY = this.y - this.vy;
        if (newX > this.edge.x2 || newY < this.edge.y2)
          break ;
        this.x  = newX;
        this.y = newY;
      }
      if (this.name == "paddle_3")
        console.log(`moving up  end x = ${this.x}, y = ${this.y}`);
    } 
    else if (this.moveDown) {
      for (let i = 1; i <= this.speed; i++) {
        let newX = this.x - this.vx;
        let newY = this.y + this.vy;
        if (newX < this.edge.x1 || newY > this.edge.y1)
          break ;
        this.x  = newX;
        this.y = newY;
        // if (this.x == this.edge.x2 || this.y == this.edge.y2)
        //   break ;
        // this.x -= this.vx;
        // this.y += this.vy;
      }
    }
  }
}


export const playerPaddle = {
    width: 10,
    height: 100,
    x: 0,
    y: 0,
    name: "player_1",
    color: "black",
    moveUp: false,
    moveDown: false,
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
    color: "black",
    moveUp: false,
    moveDown: false,
    speed: 3,
    score: new Score(),

    draw: function (context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    },
  };