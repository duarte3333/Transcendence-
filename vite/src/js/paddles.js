import { Score } from "./score.js";
import {Edge} from "./map.js";

export class Paddle {
  name;
  type;
  width;
  height;
  x; //one of the vertexes
  y; //one of the vertexes
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
  rectEdges = new Map();

  constructor(map, index) {
    this.name = "paddle_" + index;
    this.type = "player";
    this.speed = 3; // needs to change to edge.size / somthing
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
    this.angle = this.edge.angle;
    this.vx = Math.cos(this.angle);
    this.vy = Math.sin(this.angle);
    this.height = this.edge.size / 5;
    this.width = this.height / 8;
    this.moveUpKey = "w";
    this.moveDownKey = "s";
    this.x = this.edge.x1 + (this.vx * (this.edge.size / 2));
    this.y = this.edge.y1 + (this.vy * (this.edge.size / 2));
    this.gapX = 0;
    this.gapY = 0;
    this.prepRectMap()
  }

  prepRectMap() {
    let x = this.x;
    let y = this.y;
    for (let i = 1; i <= 4; i++) {
      let temp = new Edge();
      temp.setName("edge_" + i);
      temp.setPoint1(x, y);
      if (i == 1) {
        x = x + this.width * Math.cos(this.edge.perpAngle);
        y = y + this.width * Math.sin(this.edge.perpAngle);
      } else if (i == 2) {
        x = x - this.height * Math.cos(this.edge.perpAngle + Math.PI * 0.5);
        y = y - this.height * Math.sin(this.edge.perpAngle + Math.PI * 0.5);
      } else if (i == 3) {
        x = x + this.width * Math.cos(this.edge.perpAngle + Math.PI * 1);
        y = y + this.width * Math.sin(this.edge.perpAngle + Math.PI * 1);
        if (!this.gapX) {
          this.gapX = x - this.x; //size of paddle in diagonal to check when to stop moving in move
          this.gapY = y - this.y;
        }
      } else if (i == 4) {
        x = x - this.height * Math.cos(this.edge.perpAngle + Math.PI * 1.5);
      y = y - this.height * Math.sin(this.edge.perpAngle + Math.PI * 1.5);
      }
      temp.setPoint2(x, y);
      let deltaX = temp.x2 - temp.x1;
      let deltaY = temp.y2 - temp.y1;
      temp.setSize(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
      temp.setAngle(i * this.edge.perpAngle);
      temp.setperpAngle();
      this.rectEdges.set(temp.name, temp);
    }
  }

  updateRectMap() {
    let x = this.x;
    let y = this.y;
    for (let i = 1; i <= 4; i++) {
      let temp = this.rectEdges.get("edge_" + i);
      temp.setPoint1(x, y);
      if (i == 1) {
        x = x + this.width * Math.cos(this.edge.perpAngle);
        y = y + this.width * Math.sin(this.edge.perpAngle);
      } else if (i == 2) {
        x = x - this.height * Math.cos(this.edge.perpAngle + Math.PI * 0.5);
        y = y - this.height * Math.sin(this.edge.perpAngle + Math.PI * 0.5);
      } else if (i == 3) {
        x = x + this.width * Math.cos(this.edge.perpAngle + Math.PI * 1);
        y = y + this.width * Math.sin(this.edge.perpAngle + Math.PI * 1);
        if (!this.gapX) {
          this.gapX = x - this.x; //size of paddle in diagonal to check when to stop moving in move
          this.gapY = y - this.y;
        }
      } else if (i == 4) {
        x = x - this.height * Math.cos(this.edge.perpAngle + Math.PI * 1.5);
      y = y - this.height * Math.sin(this.edge.perpAngle + Math.PI * 1.5);
      }
      temp.setPoint2(x, y);
    }
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

    for (let i = 1; i <= 4; i++) {
      let temp = this.rectEdges.get("edge_" + i);
      x = temp.x2;
      y = temp.y2;
      context.lineTo(x, y);
    }

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
      this.updateRectMap();
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
      this.updateRectMap();
    }
  }
  checkColision(ball) {
    for (let i = 1; i <= 4; i++) {
      let temp = this.rectEdges.get("edge_" + i);
      if (temp.isItIn(ball.x, ball.y, ball.radius))
        return true;
    }
    return false;
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
    py = Math.round(py);
    px = Math.round(px);
    const withinYBounds = (py >= Math.min(Math.round(edge.y1), Math.round(edge.y2)) && py <= Math.max(Math.round(edge.y1), Math.round(edge.y2)));
    const withinXBounds = (px >= Math.min(Math.round(edge.x1), Math.round(edge.x2)) && px <= Math.max(Math.round(edge.x1), Math.round(edge.x2)));
    
    return withinXBounds && withinYBounds;
}


export function checkPlayers(ball, game) {
  for (let i = 1; i <= game.numberOfPlayers; i++) {
    let temp = game.objects.get("paddle_" + i);
    if (temp.checkColision(ball)) {
      return temp.edge;
    }
  }
  return 0;
}

export function bouncePlayers(ball, edge) {

    //preciso de adicionar impact point para dar um twist na bola consuante o sitio que tocou no player


   // Extract the ball's current speed
   let vx = ball.speedX;
   let vy = ball.speedY;
   
   // Calculate the normal vector components based on the edge angle
   let nx = Math.cos(edge.perpAngle);
   let ny = Math.sin(edge.perpAngle);
   
   // Calculate the dot product of the velocity vector and the normal vector
   let dotProduct = vx * nx + vy * ny;
   
   // Calculate the reflected velocity components
   let vpx = vx - 2 * dotProduct * nx;
   let vpy = vy - 2 * dotProduct * ny;
   
   // Update the ball's speed
   ball.speedX = vpx;
   ball.speedY = vpy;
   
   //keep the ball from entering player paddle!
}