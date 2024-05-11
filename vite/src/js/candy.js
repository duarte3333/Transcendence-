const canvas = document.getElementById("pongCanvas");

export const candy = {
    width: 30,
    height: 30,
    x: Math.random() * (canvas.width - 2 * 50) + 50,
    y: Math.random() * (canvas.height - 2 * 50) + 50,
    visible: true, // Visibility controlled for spawn timing
    name: "candy",
    color: "blue",
    reset: function(canvasWidth, canvasHeight, padding) {
      // Random position not too close to the walls
      this.x = Math.random() * (canvasWidth - 2 * padding) + padding;
      this.y = Math.random() * (canvasHeight - 2 * padding) + padding;
    },
    ballCollidesWithCandy: function(obj2, obj) {
      return obj2.x + obj2.radius > obj.x &&
        obj2.x - obj2.radius < obj.x + obj.width &&
        obj2.y + obj2.radius > obj.y &&
        obj2.y - obj2.radius < obj.y + obj.height;
    },
    draw: function(context) {
      if (this.visible) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
      }
    },
  };