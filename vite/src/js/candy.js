const canvas = document.getElementById("pongCanvas");

export const candy = {
    width: 30,
    height: 30,
    x: Math.random() * (canvas.width - 2 * 50) + 50,
    y: Math.random() * (canvas.height - 2 * 50) + 50,
    visible: true, // Visibility controlled for spawn timing
    name: "candy",
    color: "blue",
    reset: function(canvasWidth, canvasHeight, padding, player_1, player_2) {
      // Random position not too close to the walls
      this.x = Math.random() * (canvasWidth - 2 * padding) + padding;
      this.y = Math.random() * (canvasHeight - 2 * padding) + padding;
      //after 5 seconds, restore visibility of candy and height of bar
        setTimeout(() => {
            this.visible = true;
            player_1.height = 100;
            player_2.height = 100;
        }, 5000);
    },
    draw: function(context) {
      if (this.visible) {
        //context.fillStyle = this.color;
        context.fillStyle = this.color;  
        context.fillRect(this.x, this.y, this.width, this.height);
      }
    },
  };