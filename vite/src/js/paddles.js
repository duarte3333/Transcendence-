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
  gapX;
  gapY;
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
    // this.edge.print();
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
    this.gapX = x - this.x;
    this.gapY = y - this.y;

    x = x - this.height * Math.cos(this.edge.perpAngle + Math.PI * 1.5);
    y = y - this.height * Math.sin(this.edge.perpAngle + Math.PI * 1.5);
    context.lineTo(x, y);

    context.closePath();
    context.fill();
  }

  move() {
    if (this.moveUp) {
      for (let i = 1; i <= this.speed; i++) {
        let newX = this.x + this.vx;
        let newY = this.y + this.vy;
        //checks if new point its outside the wall
        if (isPointOnEdge(newX + this.gapX, newY +this.gapY, this.edge)) {
            this.x  = newX;
            this.y = newY;
        } else {
          break ;
        }
      }
    } 
    else if (this.moveDown) {
      for (let i = 1; i <= this.speed; i++) {
        let newX = this.x - this.vx;
        let newY = this.y - this.vy;
        //checks if new point its outside the wall
        if (isPointOnEdge(newX, newY , this.edge)) {
          this.x  = newX;
          this.y = newY;
        } else {
          break ;
        }
        this.x  = newX;
        this.y = newY;
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

  function isPointOnEdge(px, py, edge) {
    // Calculate the cross product to check for collinearity
    let crossProduct = (px - edge.x1) * (edge.y2 - edge.y1) - (py - edge.y1) * (edge.x2 - edge.x1);
    crossProduct = Math.abs(crossProduct);
    crossProduct = Math.round(crossProduct);
    
    // If the cross product is not zero, the point is not on the line
    if (crossProduct !== 0) {
      return false;
    }

    // Check if the point is within the bounds of the segment
    // py = Math.round(py);
    // px = Math.round(px);
    const withinXBounds = (px >= Math.min(edge.x1, edge.x2) && px <= Math.max(edge.x1, edge.x2));
    const withinYBounds = (py >= Math.min(edge.y1, edge.y2) && py <= Math.max(edge.y1, edge.y2));
    
    return withinXBounds && withinYBounds;
}