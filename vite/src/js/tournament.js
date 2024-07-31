document.addEventListener('DOMContentLoaded', () => {
    const playerNameInput = document.getElementById('player-name');
    const addPlayerButton = document.getElementById('add-player');
    const playerList = document.getElementById('player-list');
    const startTournamentButton = document.getElementById('start-tournament');
    const bracket = document.getElementById('bracket');

    let players = [];

    addPlayerButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            players.push(playerName);
            const li = document.createElement('li');
            li.textContent = playerName;
            playerList.appendChild(li);
            playerNameInput.value = '';
        }
    });

    startTournamentButton.addEventListener('click', () => {
        if (players.length < 2) {
            alert('Please add at least two players.');
            return;
        }
        generateBracket(players);
    });

    function generateBracket(players) {
        bracket.innerHTML = '';
        let rounds = [];

        while (players.length > 1) {
            const round = [];
            while (players.length > 1) {
                const player1 = players.shift();
                const player2 = players.length ? players.shift() : 'BYE';
                round.push([player1, player2]);
            }
            rounds.push(round);
            players = round.map(match => match[0]); // Winners move to the next round
        }

        displayBracket(rounds);
    }

    function displayBracket(rounds) {
        rounds.forEach((round, index) => {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            roundDiv.innerHTML = `<h3>Round ${index + 1}</h3>`;
            round.forEach(match => {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'match-up';
                matchDiv.innerHTML = `<div>${match[0]}</div><div>vs</div><div>${match[1]}</div>`;
                roundDiv.appendChild(matchDiv);
            });
            bracket.appendChild(roundDiv);
        });

        const finalMatch = rounds[rounds.length - 1][0];
        const finalDiv = document.createElement('div');
        finalDiv.className = 'round';
        finalDiv.innerHTML = `<h3>Final</h3>
                              <div class="match-up">
                                  <div>${finalMatch[0]}</div>
                                  <div>vs</div>
                                  <div>${finalMatch[1]}</div>
                              </div>`;
        bracket.appendChild(finalDiv);
    }
});
