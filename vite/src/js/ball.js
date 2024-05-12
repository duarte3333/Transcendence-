// Ball object
export const ball = {
    x: 0,
    y: 0,
    radius: 10,
    speedX: 4,
    speedY: 0,
    color: "white",
    name: "ball", 
    last_hit: "player_1",


    draw: function (context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    },
  };