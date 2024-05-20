export class Score {
  constructor() {
    this.value = 0;
  }

  addScore() {
    this.value += 1;
  }

  getScore() {
    return this.value;
  } 

  showScore(objects, context, canvas) {
    context.fillStyle = "white";
    const player_1 = objects.get("player_1");
    const player_2 = objects.get("player_2");
    context.font = "25px Verdana, sans-serif";
    context.fillText(player_1.score.getScore(), canvas.width / 4, 50);
    context.fillText(player_2.score.getScore(),(canvas.width / 4) * 3, 50);
  }

} 