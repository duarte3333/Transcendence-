export class events {
    constructor(game) {
        this.game = game; 
        this.initializeUIButtons();
        // this.initializeTournament();
    }

    setupControls(handleKeyDown, handleKeyUp) {
        
        if (document.getElementById("keydown") == null) {
            console.log("keydown está a ser chamado.");
        }

        function handleKeyDownAction(event)
        {
            document.addEventListener("keydown", handleKeyDownAction.bind(this));
        }

        function handleKeyUpAction(event)
        {
            document.addEventListener("keyup", handleKeyUpAction.bind(this));
        }

        this.removeControls = () => {
            document.removeEventListener("keydown", handleKeyDownAction.bind(this));
            document.removeEventListener("keyup", handleKeyUpAction.bind(this));
        }
    }


    removeControls = () => {}



    initializeUIButtons() {
        const speedControl = document.getElementById('speedControl');
        const aiButton = document.getElementById('AiButton');
        const playerButton = document.getElementById('PlayerButton');
        const pauseGame = document.querySelectorAll('.pauseGame');
        const menuClose = document.getElementById('menuClose');

        if (speedControl) {
            speedControl.addEventListener('change', () => {
                const newSpeed = speedControl.value;
                this.game.updateGameSpeed(parseFloat(newSpeed));
            });
        }

        if (menuClose) {
            menuClose.addEventListener('click', () => {
                if (this.game.pause) {
                    this.game.pause = !this.game.pause;
                }
            });
        }

        if (aiButton && playerButton) {
            aiButton.addEventListener('click', () => {
                if (this.game.objects) {
                    const playerPaddle_ai = this.game.objects.get("player_2") || this.game.objects.get("ai");
                    playerPaddle_ai.name = "ai";
                    //console.log(playerPaddle_ai.name);
                }
                aiButton.className = "btn btn-dark";
                playerButton.className = "btn btn-light";

                });
            playerButton.addEventListener('click', () => {
                if (this.game.objects) {
                    const playerPaddle_2 = this.game.objects.get("player_2") || this.game.objects.get("ai");
                    playerPaddle_2.name = "player_2";
                    //console.log(playerPaddle_2.name);
                }
                aiButton.className = "btn btn-light";
                playerButton.className = "btn btn-dark";
            });
        }
        pauseGame.forEach(button => {
            button.addEventListener('click', () => {
                if (!this.game.pause) {
                    this.game.pause = !this.game.pause;
                }
            });
        });
    }

    // initializeTournament()  {
    //     const addPlayerButton = document.getElementById('add-player');
    //     const playerNameInput = document.getElementById('player-name');
    //     const playerList = document.getElementById('player-list');
    //     const startTournamentButton = document.getElementById('start-tournament');

    //     addPlayerButton.addEventListener('click', () => {
    //         const playerName = this.playerNameInput.value.trim();
    //         if (playerName) {
    //             this.game.tournament.players.push(playerName);
    //             const li = document.createElement('li');
    //             li.textContent = playerName;
    //             playerList.appendChild(li);
    //             playerNameInput.value = '';
    //         }
    //     });
    
    //     startTournamentButton.addEventListener('click', () => {
    //         if (this.game.tournament.players.length < 2) {
    //             alert('Please add at least two players.');
    //             return;
    //         }
    //         this.game.tournament.generateBracket(this.game.tournament.players);
    //     });
    // }
}
