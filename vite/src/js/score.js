export class Score {
  constructor() {
    this.score = 0;
  }

  addScore() {
    this.score += 1;
  }

  getScore() {
    return this.score;
  }

}