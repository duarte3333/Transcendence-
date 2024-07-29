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

function autoFillDebugKeys() {
    const numPlayers = document.getElementById('numPlayers').value || 4; // Default to 4 players if none selected
    const startCharCode = 'a'.charCodeAt(0); // Starting ASCII code for 'a'
    
    for (let i = 1; i <= numPlayers; i++) {
        const upKeyInput = document.getElementById(`player${i * 2 - 1}Keys`);
        const downKeyInput = document.getElementById(`player${i * 2}Keys`);

        if (upKeyInput && downKeyInput) {
            upKeyInput.value = String.fromCharCode(startCharCode + 2 * (i - 1));   // e.g., 'a', 'c', 'e', ...
            downKeyInput.value = String.fromCharCode(startCharCode + 2 * (i - 1) + 1); // e.g., 'b', 'd', 'f', ...
        }
    }
}

// Event listener for the debug fill button
document.getElementById('debugFill').addEventListener('click', autoFillDebugKeys);


document.getElementById('numPlayers').addEventListener('input', displayExtendedForm);

document.getElementById('playerForm').addEventListener('submit', function(event) {
    
    event.preventDefault();  // Prevent the default form submission
    const numPlayers = document.getElementById('numPlayers').value;
    const playerData = {};
    const keysSet = new Set();
    let allFilled = true;

    //if i click in tab is fills all the keys from 0 to n
    for (let i = 1; i <= numPlayers; i++) {
        const upKey = document.getElementById(`player${i*2 - 1}Keys`).value;
        const downKey = document.getElementById(`player${i * 2}Keys`).value;
        if (!upKey || !downKey) {
            alert(`Please fill in both keys for Player ${i}`);
            allFilled = false;
            break;
        }
        if (upKey === downKey) {
            alert(`Player ${i} cannot have the same key for both up and down.`);
            allFilled = false;
            break;
        }
        
        if (keysSet.has(upKey) || keysSet.has(downKey)) {
            alert(`Keys must be unique. The key ${upKey} or ${downKey} is already used.`);
            allFilled = false;
            break;
        }
        keysSet.add(upKey);
        keysSet.add(downKey);
        playerData[`Player${i}`] = [upKey, downKey];

    }
    
    //hide form:
    
    if ( allFilled ){
        const form = document.getElementById("gameForm");
        form.style.display = "none";
        const game = new Game(numPlayers, playerData);
    }
});