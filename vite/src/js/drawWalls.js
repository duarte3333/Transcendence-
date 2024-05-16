export function drawPolygon(radius, sides) {
    if (sides < 4) //protect in case there is only one player and player * 2 is equal to 2
        sides = 4;
    const canvas = document.getElementById("wallsCanvas");
    let sideLength = 2 * radius * Math.sin(Math.PI / sides);
    let centerToSideLength = Math.sqrt(Math.pow(radius, 2) - Math.pow(sideLength / 2, 2)); //Calculates with pythagorean theorem the length betweeen center and sides of polygon
    if (sides % 4 === 0) { // reajust size to full canvas if none of the vertix are touching canvas walls.
        radius = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius / (sides / 4), 2));
        sideLength = 2 * radius * Math.sin(Math.PI / sides);
        centerToSideLength = Math.sqrt(Math.pow(radius, 2) - Math.pow(sideLength / 2, 2));
    }
    let ctx = canvas.getContext('2d');
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
    ctx.fillStyle = "white";
    ctx.fill();
}

export function getPixelColor(x, y) {
    const canvas = document.getElementById("wallsCanvas");
    let ctx = canvas.getContext('2d');
    let pixelData = ctx.getImageData(x, y, 1, 1).data;
    if (pixelData[0] == 0 && pixelData[1] == 0 &&  pixelData[2] == 0 && (pixelData[3] == 0 || pixelData[3] == 255))
        return true;
    return false;
}
