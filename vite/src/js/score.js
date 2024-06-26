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

export function createScoreBoard(numberOfPlayers) {
  const scoreboardContainer = document.getElementById('scoreBoard');

  for (let i = 1; i <= numberOfPlayers; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    const center = document.createElement('div');
    center.classList.add('text-center');
    const img = document.createElement('img');
    img.classList.add('imgAvatar');
    img.src = "img/p1.png";
    img.alt = `Player_${i}'s avatar`;
    center.appendChild(img);
    const playerName = document.createElement('h5');
    playerName.classList.add('playerName');
    playerName.textContent = "Player_" + i;
    const playerScore = document.createElement('h5');
    playerScore.classList.add('playerScore');
    playerScore.textContent = 0;
    playerScore.id = "playerScore_" + i;
    center.appendChild(playerName);
    center.appendChild(playerScore);
    row.appendChild(center);
    scoreboardContainer.appendChild(row);
  }

}


export function updateScore(playerName) {
  const score = document.getElementById("playerScore_" + playerName.charAt(playerName.length - 1));
  score.textContent++;
}