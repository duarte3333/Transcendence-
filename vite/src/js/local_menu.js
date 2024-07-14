const playerControls = document.getElementById('playerControls');

document.getElementById('numPlayers').addEventListener('input', function() {
    const numPlayers = this.value;
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
            input.value = event.key.toUpperCase();  // Capture the key and convert to uppercase
            document.removeEventListener('keydown', keyHandler);  // Remove the event listener after capturing the key
        });
    }
});

document.getElementById('playerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission
    console.log(`entrou submit`);

    const numPlayers = document.getElementById('numPlayers').value;
    const playerData = {};

    for (let i = 1; i <= numPlayers; i++) {
        const upKey = document.getElementById(`player${i*2 - 1}Keys`).value;
        const downKey = document.getElementById(`player${i * 2}Keys`).value;
        playerData[`Player${i}`] = [upKey, downKey];
    }
    console.log('Player Data:', playerData);
    
    // Redirect to the home page or the desired location
    //window.location.href = "home.html";
});

// document.addEventListener("DOMContentLoaded", (event) => {
//     //CHECK IF ALL FIELDS ARE FILLED
//     const controlsButton = document.getElementById("controlsButton");
//     if (controlsButton) {
//       controlsButton.addEventListener("click", function () {
//         //all fill spaces must be filled
//         const numPlayers = document.getElementById("numPlayers").value;
//         let all_filled = true;
//         for (let i = 1; i <= numPlayers; i++) {
//           const input = document.getElementsByName(`player${i}Keys`)[0];
//           if (!input.value) {
//             all_filled = false;
//             alert(`Please fill in keys for Player ${i}`);
//             break;
//           }
//         }
//         if (all_filled) {
//           document.getElementById('playerForm').submit();
//         }
//       });
//     }
// });