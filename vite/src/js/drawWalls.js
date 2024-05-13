export function drawPolygon(canvas, width, height, sides) {
    var sideLength = 2 * width * Math.sin(Math.PI / sides);
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    ctx.moveTo(x + width, canvas.height / 2);
    for (var i = 1; i <= sides; i++) {
        ctx.lineTo(x + width * Math.cos(i * 2 * (Math.PI) / sides), y + height * Math.sin(i * 2 * (Math.PI) / sides));
    }
    console.log("1 = " + (Math.cos(i * 2 * (Math.PI) / sides)) + ";2 = " + (2 * (Math.PI) / sides) + ";3 = " + (i * 2 * (Math.PI) / sides))
    ctx.closePath();
    ctx.stroke();
}

// for (var i = 1; i <= sides; i++) {
//     var angle = i * 2 * (Math.PI) / sides; // Current angle
//     ctx.lineTo(x + width * Math.cos(angle), y + height * Math.sin(angle));
// }