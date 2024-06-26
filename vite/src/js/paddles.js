import { Score } from "./score.js";
import {Edge} from "./map.js";

export class Paddle {
  name;
  type;
  width;
  height;
  x; //one of the vertexes
  y; //one of the vertexes
  centerX;
  centerY;
  vx;
  vy;
  gapX;
  gapY;
  angle;
  edge; //baliza
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
    this.moveDown = false;
    this.moveUp = false;
    this.score = new Score();
    this.color = "black";
    const edgeKey = "edge_" + (index * 2);
    this.edge = map.polygon.get(edgeKey);
    this.speed = this.edge.size / 70;
    if (!this.edge) {
      console.error(`Edge with key ${edgeKey} not found in map.polygon`);
      return;
    }
    this.edge.class = "goal";
    this.edge.goalKeeper = this.name;
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
      console.log(`player = ${this.name}, edge = ${temp.name}`);
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
      temp.class = "wall";
      this.rectEdges.set(temp.name, temp);
    }
    let temp = this.rectEdges.get("edge_2"); //get the center of rect by the oposit vertexes
    this.centerX = (this.x + temp.x2) / 2;
    this.centerY = (this.y + temp.y2) / 2;
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
    let temp = this.rectEdges.get("edge_2"); //update the center of rect by the oposit vertexes
    this.centerX = (this.x + temp.x2) / 2;
    this.centerY = (this.y + temp.y2) / 2;
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
        return temp;
    }
    return 0;
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
    let edge = temp.checkColision(ball)
    if (edge)
      return {edge, temp};
  }
  return 0;
}

// needs to be redone
export function bouncePlayers(ball, edge, player) {

  // Extract the ball's current speed
  let vx = ball.speedX;
  let vy = ball.speedY;
  
  // Calculate the normal vector components based on the edge angle
  console.log(`player name: ${player.name}, edge hit: ${edge.name}, angle: ${edge.perpAngle}`);
  console.log(`inicio ball x =  ${ball.x}, ball y =  ${ball.y}, ball speedx = ${ball.speedX},  ball speedy = ${ball.speedY}`)
  let nx = Math.cos(edge.perpAngle);
  let ny = Math.sin(edge.perpAngle);
  
  // Calculate the dot product of the velocity vector and the normal vector
  let dotProduct = vx * nx + vy * ny;
  
  // Calculate the reflected velocity components
  let vpx = vx - 2 * dotProduct * nx;
  let vpy = vy - 2 * dotProduct * ny;
  
  // Calculate the distance from the ball to the center of the paddle
  let distanceFromCenter = ball.y - player.centerY;

  // Normalize the distance to a range between -1 and 1
  let normalizedDistance = distanceFromCenter / (player.height / 2);

  // Adjust the bounce angle based on the distance from the center
  let angleAdjustment = normalizedDistance * Math.PI / 4; // 45 degree max adjustment
  let speedMultiplier = 1 + Math.abs(normalizedDistance) * 0.25; // Speed increases up to 50%

  // Convert the reflection components to angle and speed
  // ball.speed *= speedMultiplier;
  let angle = Math.atan2(vpy, vpx);
  if (angle > 0)
      angle -= angleAdjustment;
  else
      angle += angleAdjustment;

  // Update the ball's speed and direction
  ball.speedX = Math.cos(angle);
  ball.speedY = Math.sin(angle);
   
   //keep the ball from entering player paddle!
    if (ball.x > player.centerX)
      ball.x += 1;
    else
      ball.x += -1; 

    if (ball.y > player.centerY)
      ball.y += 1;
    else
      ball.y += -1;
      console.log(`fim ball x =  ${ball.x}, ball y =  ${ball.y}, ball speedx = ${ball.speedX},  ball speedy = ${ball.speedY}, ball angle = ${angle}`)
     ball.updateLastHit(player.name);
}