export function drawPolygon(canvas, width, height, sides) {
    var sideLength = 2 * width * Math.sin(Math.PI / sides);
    var centerToSideLength = Math.sqrt(Math.pow(width, 2) - Math.pow(sideLength / 2, 2)); //Calculates with pythagorean theorem the length betweeen center and sides of polygon
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    var x = canvas.width / 2 + sideLength / 2; //startging position x
    var y = canvas.height / 2 - centerToSideLength; //starting position y
    var angle = 2 * (Math.PI) / sides; // angle created by each side of the polygon
    ctx.moveTo(x, y);
    // each iteration updates y and x with the nex vertix and the angle is multiplied times iterations
    for (var i = 1; i <= sides; i++) {
        x = x + sideLength * Math.cos(i * angle);
        y = y + sideLength * Math.sin(i * angle);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
}
