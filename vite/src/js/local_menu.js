import  {Game} from "./game.js"

const playerControls = document.getElementById('playerControls');

function displayExtendedForm(){
    const numPlayers = this.value;
    if (numPlayers && numPlayers < 2) {
        alert("Please selecte a value greater than 2!");
        return ;
    }
    playerControls.innerHTML = '';
    for (let i = 1; i <= (numPlayers * 2); i++) {

        const input = document.createElement('input');
        input.name = `player${i}Keys`;

        if (i % 2) {
            input.placeholder = 'Press a up key...';
            const label = document.createElement('label');
            label.innerHTML = `Player ${Math.round(i / 2)} Keys: `;
            playerControls.appendChild(label);
        } else {
            input.placeholder = 'Press a down key...';
        }
        input.type = 'text';
        input.id = `player${i}Keys`;
        input.readOnly = true;  // Make the input read-only
        playerControls.appendChild(input);
        playerControls.appendChild(document.createElement('br'));

        // Add event listener to capture key press
        input.addEventListener('keydown', function keyHandler(event) {
            input.value = event.key;  // Capture the key
            document.removeEventListener('keydown', keyHandler);  // Remove the event listener after capturing the key
        });
    }
}

document.getElementById('numPlayers').addEventListener('input', displayExtendedForm);
// document.addEventListener('DOMContentLoaded', displayExtendedForm); //SE DEIXARMOS UM NR EM CASH DA MERDA, ISTO NAO RESOLVE

document.getElementById('playerForm').addEventListener('submit', function(event) {
    //add achekc if it is all filled...


    //hide form:
    const form = document.getElementById("gameForm");
    form.style.display = "none";

    event.preventDefault();  // Prevent the default form submission

    const numPlayers = document.getElementById('numPlayers').value;
    const playerData = {};

    for (let i = 1; i <= numPlayers; i++) {
        const upKey = document.getElementById(`player${i*2 - 1}Keys`).value;
        const downKey = document.getElementById(`player${i * 2}Keys`).value;
        playerData[`Player${i}`] = [upKey, downKey];
    }
    //add somthing to parse info

    const game = new Game(numPlayers, playerData);
});