export class Page {
    #displayFunction;
    #eventInfo;
    #name;
    #onDisplay;

    constructor(name, displayFunc, events) {
        this.#displayFunction = displayFunc;
        this.#eventInfo = [];
        this.#name = name;
        this.#onDisplay = "none";
        if (events) this.addEvents(events);
    }

    setEvents(...events) {
        events.forEach(event => {
            if (!Array.isArray(event) || event.length !== 3) {
                console.log('Invalid event format. Expected [string, string, function]');
                return ;
            }
            this.#eventInfo.push({
                id: event[0],
                type: event[1],
                handler: event[2]
            });
        });
    }

    #eventListeners(on) {
        if (!this.#eventInfo.length)
            return ;
        let element;
        this.#eventInfo.forEach(event => {
            element = document.getElementById(event.id);
            if (!element) return ;
            if (on)
                element.addEventListener(event.type, event.handler);
            else
                element.removeEventListener(event.type, event.handler);
        });
    }

    display(state) {
        this.#onDisplay = state;
        this.#eventListeners(state === "none" ? false : true);
        this.#displayFunction(state);
    }

    isOnScreen() {
        return (this.#onDisplay !== "none");
    }

    destructor() {
        this.display("none");
    }
}
