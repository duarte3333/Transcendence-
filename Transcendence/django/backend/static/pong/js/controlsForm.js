export let theNames = []; // para usar no botao submit controls


export function displayExtendedForm(names, numberOfPlayers) {
    return new Promise((resolve) => {
        // console.log("display Extend form")
        console.log('names = ', names, 'numplayers', numberOfPlayers)
        const controls = {};
        const gameForm = document.getElementById("gameForm");
        gameForm.style.display = "block"
        const playerControls = document.getElementById('playerControls');
        const numPlayers = numberOfPlayers;
        playerControls.innerHTML = '';
        for (let i = 1; i <= (numPlayers * 2); i++) {
            const input = document.createElement('input');
            input.name = names[Math.floor((i - 1) / 2)];

            if (i % 2) {
                input.placeholder = 'Press a up key...';
                const label = document.createElement('label');
                label.innerHTML = names[Math.floor((i - 1) / 2)];
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
            input.addEventListener('keydown', function (event) {
                event.preventDefault(); 
                input.value = event.key;  // Capture the key
            });
        }
        theNames = names;
        // Attach event listener to the controlsButton
        const controlsButton = document.getElementById('controlsButton');
        let allFilled = false;
        controlsButton.addEventListener('click', (event) => {
            event.preventDefault();  // Prevent the default form submission
            const keysSet = new Set();

            for (let i = 1; i <= numPlayers; i++) {
                const upKey = document.getElementById(`player${i * 2 - 1}Keys`).value;
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
                allFilled = true;
                keysSet.add(upKey);
                keysSet.add(downKey);
                controls[theNames[i - 1]] = [upKey, downKey];
            }

            if (allFilled) {
                const form = document.getElementById("gameForm");
                form.style.display = "none";
                resolve(controls);
            }
        });
    });
}
