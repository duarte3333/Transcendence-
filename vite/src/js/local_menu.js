export const playerControls = document.getElementById('playerControls');

document.getElementById('numPlayers').addEventListener('input', function() {
    console.log(`entrou change`);
    const numPlayers = this.value;
    playerControls.innerHTML = '';
    for (let i = 1; i <= numPlayers; i++) {
        const label = document.createElement('label');
        label.innerHTML = `Player ${i} Keys:`;
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player${i}Keys`;
        input.placeholder = 'Enter keys (e.g., W,S)';
        playerControls.appendChild(label);
        playerControls.appendChild(input);
    }
});


document.getElementById('playerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission
    console.log(`entrou submit`);


    const numPlayers = document.getElementById('numPlayers').value;
    for (let i = 1; i <= numPlayers; i++) {
        let value = document.getElementById(`player${i}Keys`).value;
        if (value)
            console.log(`player${i}Keys: ${value}`);
        else
            console.log("write a value");
    }
});