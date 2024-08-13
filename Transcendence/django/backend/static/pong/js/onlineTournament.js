document.addEventListener('DOMContentLoaded', function() {
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const startTournamentBtn = document.getElementById('startTournamentBtn');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');
    const invitePlayerBtn = document.getElementById('invitePlayerBtn');
    const playerNameInput = document.getElementById('playerNameInput');
    const playerList = document.getElementById('playerList');

    // Array to store player names
    let players = [];

    // Show the popup
    addPlayerBtn.addEventListener('click', function() {
        popup.style.display = 'flex';
    });

    // Close the popup
    closePopup.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Invite player and add to the list
    invitePlayerBtn.addEventListener('click', function() {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            players.push(playerName);
            updatePlayerList();
            playerNameInput.value = '';
            popup.style.display = 'none';
        } else {
            alert('Please enter a player name');
        }
    });

    // Start tournament logic
    startTournamentBtn.addEventListener('click', function() {
        if (players.length < 2) {
            alert('At least 2 players are required to start the tournament');
        } else {
            startTournament();
        }
    });

    // Update the player list display
    function updatePlayerList() {
        playerList.innerHTML = '';
        players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = player;
            playerList.appendChild(playerDiv);
        });
    }

    // Example function to start the tournament (you can customize this)
    function startTournament() {
        alert(`Starting tournament with ${players.length} players: ${players.join(', ')}`);
    }
});
