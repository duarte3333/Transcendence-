import {Edge} from "./map.js";

export class Paddle {
  name;
  displayName;
  type;
  width;
  height;
  x; //one of the vertexes
  y; //one of the vertexes
  centerX;
  centerY;
  bounceX; // created to normalize bounce angle
  bounceY;
  vx;
  vy;
  gapX;
  gapY;
  angle;
  edge; //baliza
  speed;
  moveDown;
  moveUp;
  moveUpKey;
  moveDownKey;
  color;
  rectEdges = new Map();

  constructor(map, index, numberOfPlayers, controlsList, name) {
    this.name = "paddle_" + index;
    this.displayName = name;
    this.type = "player";
    this.moveDown = false;
    this.moveUp = false;
    this.color = "black";
    let edgeNumber;
    if (numberOfPlayers != 2)
      edgeNumber = index * 2;
    else
      edgeNumber = index * 2 - 1;
    const edgeKey = "edge_" + (edgeNumber);
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
    this.width = this.height / 15;
    if (this.width < 7)
        this.width = 7;
    if (this.vy < 0) {
      [this.moveDownKey, this.moveUpKey] = controlsList;
    } else {
      [this.moveUpKey, this.moveDownKey] = controlsList;
      // [this.moveDownKey, this.moveUpKey] = controlsList;
    }
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
      temp.setAngle(Math.atan2(deltaY, deltaX));
      temp.setperpAngle();
      temp.class = "wall";
      this.rectEdges.set(temp.name, temp);
    }
    let temp = this.rectEdges.get("edge_2"); //get the center of rect by the oposit vertexes
    this.centerX = (this.x + temp.x2) / 2;
    this.centerY = (this.y + temp.y2) / 2;
    this.bounceX = this.centerX + (Math.cos(this.edge.perpAngle + Math.PI) * 80);
    this.bounceY = this.centerY + (Math.sin(this.edge.perpAngle + Math.PI) * 80);
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
        this.gapX = x - this.x; //size of paddle in diagonal to check when to stop moving in move
        this.gapY = y - this.y;
      } else if (i == 4) {
        x = x - this.height * Math.cos(this.edge.perpAngle + Math.PI * 1.5);
      y = y - this.height * Math.sin(this.edge.perpAngle + Math.PI * 1.5);
      }
      temp.setPoint2(x, y);
    }
    let temp = this.rectEdges.get("edge_2"); //update the center of rect by the oposit vertexes
    this.centerX = (this.x + temp.x2) / 2;
    this.centerY = (this.y + temp.y2) / 2;
    this.bounceX = this.centerX + (Math.cos(this.edge.perpAngle + Math.PI) * 80);
    this.bounceY = this.centerY + (Math.sin(this.edge.perpAngle + Math.PI) * 80);
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
        this.x  = newX;
        this.y = newY;
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

  checkColision(x, y, radius) {
    for (let i = 1; i <= 4; i++) {
      let temp = this.rectEdges.get("edge_" + i);
      if (temp.isItIn(x, y, radius))
        return temp;
    }
    return 0;
  }
}

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


export function checkPlayers(x, y, radius, game) {
  for (let i = 1; i <= game.numberOfPlayers; i++) {
    let temp = game.objects.get("paddle_" + i);
    let edge = temp.checkColision(x, y, radius);
    if (edge)
      return {edge, temp};
  }
  return 0;
}

export function bouncePlayers(ball, edge, player) {
  // Calculate the difference in coordinates
  let deltaX =  ball.x - player.bounceX;
  let deltaY = ball.y - player.bounceY;

  // Calculate the angle in radians using atan2
  let angleRadians = Math.atan2(deltaY, deltaX);

  let vpx = Math.cos(angleRadians);
  let vpy = Math.sin(angleRadians);
  
  // Update the ball's direction
  ball.speedX = vpx;
  ball.speedY = vpy;
  
  //keep the ball from entering player paddle!
  if (ball.x > player.centerX)
    ball.x += 1;
  else
    ball.x += -1; 

  if (ball.y > player.centerY)
    ball.y += 1;
  else
    ball.y += -1;

  ball.updateLastHit(player.name);
}


export function writePaddleNames(game) {
  const canvas = document.getElementById("pongCanvas");
  game.context.font = "30px Arial"; // Define a fonte e o tamanho
  //add transparency to this text
  game.context.fillStyle = "rgb(154, 153, 150)";

  let centerXcanvas = canvas.width / 2;
  let centerYcanvas = canvas.height / 2;
  for (let i = 1; i <= game.numberOfPlayers; i++) {
    let temp = game.objects.get("paddle_" + i);
    let dirX = 0
    let midpointx = (temp.centerX + centerXcanvas) / 2;
    let midpointy = (temp.centerY + centerYcanvas) / 2;
    let midpointxofmid = (temp.centerX + midpointx) / 2;
    let midpointyofmid = (temp.centerY + midpointy) / 2;
    let finalx = (temp.centerX + midpointxofmid) / 2;
    let finaly = (temp.centerY + midpointyofmid) / 2;
    if (temp.centerX > canvas.width / 2)
      dirX = -125;
    game.context.fillText(temp.displayName, finalx + dirX, finaly);
  }
}