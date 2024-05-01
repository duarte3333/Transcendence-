export class Score {
  constructor() {
    this.score = 0;
  }

  addScore() {
    this.score += 10;
  }

  getScore() {
    return this.score;
  }

}