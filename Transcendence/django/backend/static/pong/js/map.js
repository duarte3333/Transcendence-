//edge class
export class Edge {
    name;
    class;
    goalKeeper;
    x1;
    y1;
    x2;
    y2;
    size;
    angle;
    perpAngle;
    areaHit;

    print() {
        console.log("--" + this.name + "--");
        console.log("x1 = " + this.x1 + ", y1 = " + this.y1);
        console.log("x2 = " + this.x2 + ", y2 = " + this.y2);
        console.log("size = " + this.size);
        console.log("angle = " + this.angle);
        console.log("perpAngle = " + this.perpAngle);
    }

    distanceSquared(x1, y1, x2, y2) {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }

    // Helper function to clamp a value between a minimum and maximum
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    isItIn(x, y, radius) {
        // Vector from x1, y1 to x2, y2
        const edgeVecX = this.x2 - this.x1;
        const edgeVecY = this.y2 - this.y1;

        // Vector from x1, y1 to the point
        const pointVecX = x - this.x1;
        const pointVecY = y - this.y1;

        // Project pointVec onto edgeVec to find the closest point on the line segment
        const edgeLengthSquared = this.distanceSquared(this.x1, this.y1, this.x2, this.y2);
        const t = this.clamp((pointVecX * edgeVecX + pointVecY * edgeVecY) / edgeLengthSquared, 0, 1);

        // Coordinates of the closest point on the line segment
        const closestX = this.x1 + t * edgeVecX;
        const closestY = this.y1 + t * edgeVecY;

        // Calculate the distance from the point to the closest point on the line segment
        const distanceSquared = this.distanceSquared(x, y, closestX, closestY);

        this.areaHit = radius * radius - distanceSquared;
        return distanceSquared <= radius * radius;
    }

    setName(n) {
        this.name = n;
    }

    setPoint1(x, y) {
        if (x < 0)
            x = 0;
        if (y < 0)
            y = 0;
        this.x1 = x;
        this.y1 = y;
    }

    setPoint2(x, y) {
        if (x < 0)
            x = 0;
        if (y < 0)
            y = 0;
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
        if (this.perpAngle >= 2 * Math.PI)
            this.perpAngle -= 2 * Math.PI;
    }
    
    getperpAngle() {
        return this.perpAngle;
    }

    draw(context) {
        if (this.class == "wall") {
            context.strokeStyle = "black";
            context.lineWidth = 2;
        } else if (this.class == "goal") {
            context.strokeStyle = "blue";
            context.lineWidth = 2;
        }
    
        context.beginPath();
        context.moveTo(this.x1, this.y1);
        context.lineTo(this.x2, this.y2);
        context.closePath();
        context.stroke();
    }
}


// Map object
export const map = {
    polygon: new Map(),
    img: new Image(),
    pattern: new Image(),
    radius: 10,
    size: 0,
    color: "white",
    sides: 4,
    name: "map",
    wallHit: "",
    sideLength: 0,
    centerToSideLength: 0,

    prepareMap: function () {
        this.sideLength = 2 * this.radius * Math.sin(Math.PI / this.sides);
        this.centerToSideLength = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(this.sideLength / 2, 2));
        if (this.sides % 4 === 0) { // reajust size to full canvas if none of the vertix are touching canvas walls.
            this.radius = this.radius / Math.cos((Math.PI) / this.sides); //NEEDS TO CALCULATE THE DISTANCE BETWEEN THE CENTER AND THE EDGE AT A CERTAIN ANGLE
            this.sideLength = 2 * this.radius * Math.sin(Math.PI / this.sides);
            this.centerToSideLength = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(this.sideLength / 2, 2));
        }
        let angle = 2 * (Math.PI) / this.sides;
        let x = this.size / 2 + this.sideLength / 2;
        let y = this.size / 2 - this.centerToSideLength;
        // goes to every point on the polygon adding it to each edge so it can be easy to access
        for (var i = 1; i <= this.sides; i++) {
            let temp = new Edge();
            temp.setName("edge_" + i);
            temp.setPoint1(x, y);
            temp.setAngle(i * angle);
            temp.setperpAngle();
            temp.setSize(this.sideLength);
            x = x + this.sideLength * Math.cos(i * angle);
            y = y + this.sideLength * Math.sin(i * angle);
            temp.setPoint2(x, y);
            temp.class = "wall";
            //print
            // temp.print();
            this.polygon.set("edge_" + i, temp);
        }
    },

    checkWalls: function (x, y, radius) {
        for (let i = 1; i <= map.sides; i++) {
            let temp = map.polygon.get("edge_" + i);
            if (temp.isItIn(x, y, radius)) {
                this.wallHit = temp.name;
                // temp.print();
                return temp;
            }
        }
        return 0;
    },

    draw: function (context) {

        const canvas = document.getElementById("pongCanvas");
        this.img.onload = () => {
            const imgX = (canvas.width - this.img.width) / 2;
            const imgY = (canvas.height - this.img.height) / 2;
    
            context.drawImage(this.img, imgX, imgY);

            context.beginPath();
            context.moveTo(0,0);
            context.lineTo(canvas.width,0);
            context.lineTo(canvas.width,canvas.height);
            context.lineTo(0,canvas.height);
            let x = canvas.width / 2 + this.sideLength / 2; // starting position x
            let y = canvas.height / 2 - this.centerToSideLength; // starting position y
            let angle = 2 * Math.PI / this.sides; // angle created by each side of the polygon
            context.moveTo(x, y);

            // Each iteration updates y and x with the next vertex and the angle is multiplied times iterations
            for (let i = 1; i <= this.sides; i++) {
                x = x + this.sideLength * Math.cos(i * angle);
                y = y + this.sideLength * Math.sin(i * angle);
                context.lineTo(x, y);
            }
            context.closePath();
            // context.clip(); // <-- THIS FUNCTION SUCKS ASS
            context.fillStyle = context.createPattern(this.pattern, 'repeat');
            context.fill('evenodd');

        };
        this.img.onload();
        for (let i = 1; i <= this.sides; i++) {
            let temp = this.polygon.get("edge_" + i);
            temp.draw(context);
        }
    },
};

export function bounceWalls(ball, edge) {
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
    
    //keep the ball from entering adjacent walls
    if (ball.x > map.size / 2)
        ball.x += -1;
    else
        ball.x += 1; 

    if (ball.y > map.size / 2)
        ball.y += -1;
    else
        ball.y += 1;

    map.wallHit = "";
}