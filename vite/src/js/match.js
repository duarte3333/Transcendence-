class Match {
  winner = null;
  score = [];
  nb_players = 0;
  constructor(score, nb_players) {
    this.score = score;
    this.nb_players = nb_players;
    this.match = null;
  }

  setWinner() {
    win = INT_MIN;
    for (let i = 1; i <= this.nb_players; i++) {
        if (score[i - 1] > win) {
            this.winner = i;
            win = score[i - 1];
        }
    }
  }

  getWinner() {
    return this.winner;
  }
}