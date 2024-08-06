// import { bottom } from "@popperjs/core";
import { sleep } from "./auxFts.js";

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
  scoreboardContainer.classList.add('overflow-hidden');
  scoreboardContainer.style.paddingTop = "2%";
  scoreboardContainer.style.paddingLeft = "0%";
  scoreboardContainer.style.paddingRight = "0%";
  scoreboardContainer.style.borderRadius = "10px";
  scoreboardContainer.style.border = "3px solid #000000";
  scoreboardContainer.style.display = "flex";
  scoreboardContainer.style.flexDirection = "column";
  scoreboardContainer.style.alignItems = "center";
  scoreboardContainer.style.justifyContent = "flex-start";


  const h3 = document.createElement('h3');
  h3.classList.add('centered-text');
  h3.textContent = "ScoreBoard";
  scoreboardContainer.appendChild(h3);

  sleep(100);
  for (let i = 1; i <= numberOfPlayers; i++) {
    const row = document.createElement('div');
    row.classList.add('row', 'centerAll');
    row.style.borderBottom = "2px solid #000000";
    row.style.width = "100%";
    row.style.position = 'relative';
    row.style.overflow = 'hidden';
    row.style.backgroundSize = "cover";
    row.style.backgroundPosition = "center";
    row.style.backgroundRepeat = "no-repeat";

    // Setting up background images with transparency
    if (!(i % 2)) {
      row.style.backgroundImage = 
          "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('/static/pong/img/vamo.png')";
    } else if (!(i % 3)) {
        row.style.backgroundImage = 
            "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('/static/pong/img/lala.png')";
    } else if (!(i % 4)) {
        row.style.backgroundImage = 
            "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('/static/pong/img/lala3.png')";
    } else {
        row.style.backgroundImage = 
            "linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('/static/pong/img/lala2.png')";
    }
    row.style.position = 'relative';
    row.style.overflow = 'hidden';
    row.style.backgroundSize = "cover";
    row.style.backgroundPosition = "center";
    row.style.backgroundRepeat= "no-repeat";
    
    const col1 = document.createElement('div');
    col1.classList.add('col');
    col1.classList.add('centerAll');
    const col2 = document.createElement('div');
    col2.classList.add('col-6');
    col2.classList.add('centerAll');
    const col3 = document.createElement('div');
    col3.classList.add('col');
    col3.classList.add('centerAll');

    const img = document.createElement('img');
    img.classList.add('imgAvatar');
    img.src = "/static/pong/img/p1.png";
    img.alt = `Player_${i}'s avatar`;

    const playerName = document.createElement('h5');
    playerName.style.marginBottom = "0px";
    playerName.textContent = "Player_" + i;
    playerName.style.padding = "10px 20px";

    const playerScore = document.createElement('h5');
    playerScore.style.marginBottom = "0px";
    playerScore.textContent = 0;
    playerScore.id = "playerScore_" + i;

    col1.appendChild(img);
    col2.appendChild(playerName);
    col3.appendChild(playerScore);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    scoreboardContainer.appendChild(row);
  }
}



export function updateScore(playerName, flag) {
  const score = document.getElementById("playerScore_" + playerName.charAt(playerName.length - 1));
  if (flag)
    score.textContent++;
  else
    score.textContent--;
}

export function checkGameOver(numberOfPlayers) {
  for (let i = 1; i <= numberOfPlayers; i++) {
    const score = document.getElementById("playerScore_" + i);
    if (score.textContent >= 5) {
      return i;
    }
  }
  return -1;
}