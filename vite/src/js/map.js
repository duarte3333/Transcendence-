import { ball } from "./ball.js";

// Map object
export const map = {
    x: 0,
    y: 0,
    radius: 10,
    color: "white",
    sides: 4,
    name: "map",

    draw: function (context) {
        drawPolygon("pongCanvas", this.radius, this.sides, this.color);
    },
};

//ft that draws the polygon (map)
export function drawPolygon(canvasName, radius, sides, color) {
    const canvas = document.getElementById(canvasName);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    if (sides < 4) //protect in case there is only one player and player * 2 is equal to 2
        sides = 4;
    let sideLength = 2 * radius * Math.sin(Math.PI / sides);
    let centerToSideLength = Math.sqrt(Math.pow(radius, 2) - Math.pow(sideLength / 2, 2)); //Calculates with pythagorean theorem the length betweeen center and sides of polygon
    if (sides % 4 === 0) { // reajust size to full canvas if none of the vertix are touching canvas walls.
        radius = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius / (sides / 4), 2));
        sideLength = 2 * radius * Math.sin(Math.PI / sides);
        centerToSideLength = Math.sqrt(Math.pow(radius, 2) - Math.pow(sideLength / 2, 2));
    }
    ctx.beginPath();
    let x = canvas.width / 2 + sideLength / 2; //startging position x
    let y = canvas.height / 2 - centerToSideLength; //starting position y
    let angle = 2 * (Math.PI) / sides; // angle created by each side of the polygon
    ctx.moveTo(x, y);
    // each iteration updates y and x with the nex vertix and the angle is multiplied times iterations
    for (var i = 1; i <= sides; i++) {
        x = x + sideLength * Math.cos(i * angle);
        y = y + sideLength * Math.sin(i * angle);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

export function bounce(ball, map) {
    //horizontal walls
    if ((ball.y - ball.radius <= 0)) {
      ball.speedY = -ball.speedY;
      ball.y += 1;
    }
    if (ball.y + ball.radius >= canvas.height) {
      ball.speedY = -ball.speedY;
      ball.y -= 1;
    }
    //diagonal walls
    
}

export function getPixelColor(x, y) {
    const canvas = document.getElementById("wallsCanvas");
    let ctx = canvas.getContext('2d');
    let pixelData = ctx.getImageData(x, y, 1, 1).data;
    if (pixelData[0] == 0 && pixelData[1] == 0 &&  pixelData[2] == 0 && (pixelData[3] == 0 || pixelData[3] == 255))
        return true;
    return false;
}
