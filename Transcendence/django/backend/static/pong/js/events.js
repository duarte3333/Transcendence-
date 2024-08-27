export class events {

    #keys = new Map();
    #onhandleKeyDownAction =  this.#handleKeyDownAction.bind(this);
    #onhandleKeyUpAction = this.#handleKeyUpAction.bind(this);
    constructor() {

        document.addEventListener("keydown",  this.#onhandleKeyDownAction);
        document.addEventListener("keyup", this.#onhandleKeyUpAction);
    }

    #handleKeyDownAction(event)
    {
        if (event.key == ' ' || event.key == window.user.down_key || event.key == window.user.up_key) {
            event.preventDefault();
        }
        const key1 = event.key.toUpperCase()
        this.#keys.set(key1, true);
    }

    #handleKeyUpAction(event)
    {
        const key1 = event.key.toUpperCase()
        this.#keys.set(key1, false);
    }

    getKeyPress(key){
        //toggle and not hold
        if (key == ' ') {
            const result = (this.#keys.get(key.toUpperCase()) || false)
            const key1 = key.toUpperCase()
            this.#keys.set(key1, false);
            return result;
        }
        else //Hold
            return (this.#keys.get(key.toUpperCase()) || false);
    }

    destroyer()
    {
        document.removeEventListener("keydown",  this.#onhandleKeyDownAction);
        document.removeEventListener("keyup", this.#onhandleKeyUpAction);
    }


}
