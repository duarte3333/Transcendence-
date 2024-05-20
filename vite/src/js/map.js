import { ball } from "./ball.js";


//edge class
export class Edge {
    name;
    x1;
    y1;
    x2;
    y2;
    size;
    angle;
    perpAngle;

    print() {
        console.log("--" + this.name + "--");
        console.log("x1 = " + this.x1 + ", y1 = " + this.y1);
        console.log("x2 = " + this.x2 + ", y2 = " + this.y2);
        console.log("size = " + this.size);
        console.log("angle = " + this.angle);
        console.log("perpAngle = " + this.perpAngle);
    }

    isItIn(x, y) {
        if (((x <= this.x1 && x >= this.x2) || (x >= this.x1 && x <= this.x2)) && //is between the two vertix in the x axis
        ((y <= this.y1 && y >= this.y2) || (y >= this.y1 && y <= this.y2))) //is between the two vertix in the y axis
            return true;
        return false;
    }

    setName(n) {
        this.name = n;
    }

    setPoint1(x, y) {
        this.x1 = x;
        this.y1 = y;
    }

    setPoint2(x, y) {
        this.x2 = x;
        this.y2 = y;
    }

    setSize(s) {
        this.size = s;
    }

    setAngle(a) {
        this.angle = a;
    }

    setperpAngle() {
        this.perpAngle = this.angle + Math.PI * 0.5; //angle plus 90º in radians
        if (this.perpAngle > 2 * Math.PI)
            this.perpAngle -= 2 * Math.PI;
    }
    
    getperpAgnle() {
        return this.perpAgnle;
    }
}


// Map object
export const map = {
    polygon: new Map(),
    x: 0,
    y: 0,
    radius: 10,
    size: 0,
    color: "white",
    sides: 4,
    name: "map",

    prepareMap: function () {
        let sideLength = 2 * this.radius * Math.sin(Math.PI / this.sides);
        let centerToSideLength = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(sideLength / 2, 2));
        // if (this.sides % 4 === 0) {
        //     this.radius = Math.sqrt(Math.pow(this.radius, 2) + Math.pow(this.radius / (this.sides / Math.PI), 2));
        //     sideLength = 2 * this.radius * Math.sin(Math.PI / this.sides);
        //     centerToSideLength = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(sideLength / 2, 2));
        // }
        let x = this.size / 2 + sideLength / 2;
        let y = this.size / 2 - centerToSideLength;
        let angle = 2 * (Math.PI) / this.sides;
        // goes to every point on the polygon adding it to each edge so it can be easy to access
        for (var i = 1; i <= this.sides; i++) {
            let temp = new Edge();
            temp.setName("edge_" + i);
            temp.setPoint1(x, y);
            temp.setAngle(i * angle);
            temp.setperpAngle();
            temp.setSize(sideLength);
            x = x + sideLength * Math.cos(i * angle);
            y = y + sideLength * Math.sin(i * angle);
            temp.setPoint2(x, y);
            //print
            // temp.print();
            this.polygon.set("edge_" + i, temp);
        }
    },

    draw: function (context) {
        drawPolygon("pongCanvas", this.radius, this.sides, this.color);
    },
};

//ft that draws the polygon (map)
export function drawPolygon(canvasName, radius, sides, color) {
    const canvas = document.getElementById(canvasName);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    let sideLength = 2 * radius * Math.sin(Math.PI / sides);
    let centerToSideLength = Math.sqrt(Math.pow(radius, 2) - Math.pow(sideLength / 2, 2)); //Calculates with pythagorean theorem the length betweeen center and sides of polygon
    // if (sides % 4 === 0) { // reajust size to full canvas if none of the vertix are touching canvas walls.
    //     radius = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius / (sides / Math.PI), 2));
    //     sideLength = 2 * radius * Math.sin(Math.PI / sides);
    //     centerToSideLength = Math.sqrt(Math.pow(radius, 2) - Math.pow(sideLength / 2, 2));
    // }
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
    for (let i = 1; i <= map.sides; i++) {
        let temp = map.polygon.get("edge_" + i);
        if (temp.isItIn(ball.x, ball.y)) {
            // Calculate the normal vector components
            let nx = Math.cos(temp.angle);
            let ny = Math.sin(temp.angle);
            
            // Calculate the dot product
            let dotProduct = ball.speedX * nx + ball.speedY * ny;
            
            // Calculate the reflected vector components
            let vpx = ball.speedX - 2 * dotProduct * nx;
            let vpy = ball.speedY - 2 * dotProduct * ny;
            ball.speedX = vpx;
            ball.speedY = vpy;
            break ;
        }
    }
}

export function getPixelColor(x, y) {
    const canvas = document.getElementById("wallsCanvas");
    let ctx = canvas.getContext('2d');
    let pixelData = ctx.getImageData(x, y, 1, 1).data;
    if (pixelData[0] == 0 && pixelData[1] == 0 &&  pixelData[2] == 0 && (pixelData[3] == 0 || pixelData[3] == 255))
        return true;
    return false;
}