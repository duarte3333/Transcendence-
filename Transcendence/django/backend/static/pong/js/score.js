import { sleep } from "./auxFts.js";

let h3 = null;
let rows = [];
let scoreboardContainer = null;

export function createScoreBoard(gameScore) {
  scoreboardContainer = document.getElementById('scoreBoard');

  if (scoreboardContainer.innerHTML != '')
            return ;

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


  h3 = document.createElement('row');
  h3.className = 'centered-text h3';
  h3.textContent = "ScoreBoard";
  h3.style.width = "100%";
  h3.style.borderBottom = "2px solid #000000";
  h3.style.marginBottom = "0px";

  scoreboardContainer.appendChild(h3);

  sleep(100);

  for (const [key, value] of gameScore.entries()) {
    const row = document.createElement('div');
    rows.push(row);
    row.classList.add('row', 'centerAll');
    row.style.borderBottom = "2px solid #000000";
    row.style.width = "100%";
    row.style.position = 'relative';
    row.style.overflow = 'hidden';
    
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
    img.alt = `Player_${key}'s avatar`;

    const playerName = document.createElement('h5');
    playerName.style.marginBottom = "0px";
    playerName.textContent = key;
    playerName.style.padding = "10px 20px";

    const playerScore = document.createElement('h5');
    playerScore.style.marginBottom = "0px";
    playerScore.textContent = value;
    playerScore.id = "playerScore_" + key;

    col1.appendChild(img);
    col2.appendChild(playerName);
    col3.appendChild(playerScore);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    scoreboardContainer.appendChild(row);
    }
}

export function clearScoreBoard() {
  if (h3) h3.remove() 
  rows.forEach(row => row.remove());
  rows = [];
}



export function atualizeScore(game) {
  for (const [key, value] of game.score.entries()) {
    const html = document.getElementById("playerScore_" + key);
    if (html) {
        html.innerHTML = value;
    }
}
}