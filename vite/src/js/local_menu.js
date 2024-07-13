export const playerControls = document.getElementById('playerControls');

document.getElementById('numPlayers').addEventListener('change', function() {
    const numPlayers = this.value;
    playerControls.innerHTML = '';
    for (let i = 1; i <= numPlayers; i++) {
        const label = document.createElement('label');
        label.innerHTML = `Player ${i} Keys:`;
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `player${i}Keys`;
        input.placeholder = 'Enter keys (e.g., W,S)';
        playerControls.appendChild(label);
        playerControls.appendChild(input);
    }
});


document.getElementById('playerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission

    if (check_if_all_filled()) {
        const formData = new FormData(this);
        const playerData = formData.get('playerData');

        // Redirect to the next page with the player data
        window.location.href = `next_page.html?playerData=${encodeURIComponent(playerData)}`;
    }
});