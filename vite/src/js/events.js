export class events {
    constructor(game) {
        this.game = game; 
        document.addEventListener('DOMContentLoaded', () => {
            this.setupControls();
            this.initializeUIButtons();
        });
    }

    setupControls() {
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        const playerKeyMap = {
            "w": ["player_1", "moveUp", true],
            "s": ["player_1", "moveDown", true],
            " ": ["", "togglePause", true],
            "ArrowUp": ["player_2", "moveUp", true],
            "ArrowDown": ["player_2", "moveDown", true]
        };

        if (playerKeyMap[event.key]) {
            event.preventDefault();
            const [player, action, state] = playerKeyMap[event.key];
            if (player) {
                const paddle = this.game.objects.get(player);
                if (paddle) paddle[action] = state;
            } else {
                this.game.pause = !this.game.pause ;
            }
        }
    }

    handleKeyUp(event) {
        const playerKeyMap = {
            "w": ["player_1", "moveUp", false],
            "s": ["player_1", "moveDown", false],
            "ArrowUp": ["player_2", "moveUp", false],
            "ArrowDown": ["player_2", "moveDown", false]
        };

        if (playerKeyMap[event.key]) {
            event.preventDefault();
            const [player, action, state] = playerKeyMap[event.key];
            const paddle = this.game.objects.get(player);
            if (paddle) paddle[action] = state;
        }
    }

    initializeUIButtons() {
        const speedControl = document.getElementById('speedControl');
        const aiButton = document.getElementById('AiButton');
        const playerButton = document.getElementById('PlayerButton');

        if (speedControl) {
            speedControl.addEventListener('change', () => {
                const newSpeed = speedControl.value;
                this.game.updateGameSpeed(parseFloat(newSpeed));
            });
        }

        if (aiButton && playerButton) {
            aiButton.addEventListener('click', () => {
                if (this.game.objects) {
                    const playerPaddle_ai = this.game.objects.get("player_2") || this.game.objects.get("ai");
                    playerPaddle_ai.name = "ai";
                    console.log(playerPaddle_ai.name);
                }
                aiButton.className = "btn btn-dark";
                playerButton.className = "btn btn-light";

                });
            playerButton.addEventListener('click', () => {
                if (this.game.objects) {
                    const playerPaddle_2 = this.game.objects.get("player_2") || this.game.objects.get("ai");
                    playerPaddle_2.name = "player_2";
                    console.log(playerPaddle_2.name);
                }
                aiButton.className = "btn btn-light";
                playerButton.className = "btn btn-dark";
            });
        }
    }
}
