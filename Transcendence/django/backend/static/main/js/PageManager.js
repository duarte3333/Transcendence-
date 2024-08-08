import { Page } from "./Page.js";
import { AppControl } from "./AppControl.js";

export class PageManager {
    #pageMap;
    #onScreen;
    #currentPage;

    constructor(current) {
        this.#pageMap = new Map();
        this.#onScreen = new Set();
        this.#currentPage = "current";
    }

    setElement(name, displayFunction, events) {
        console.log("setElement " + name);
        if (typeof(name) !== 'string') {
            console.log(`Invalid page name: ${name}`);
            return ;
        }
        if (typeof(displayFunction) !== 'function') {
            console.log(`The value set for ${name} is not a function`);
            return ;
        }
        let page = new Page(name, displayFunction, events);
        this.#pageMap.set(name, page);
        return (page);
    }

    // async get(name) {
    //     let page = this.#pageMap.get(name);
    //     if (page)
    //         return (page);
    //     if (!(await AppControl.fetchApp(name)))
    //         return (new Page());
    //     return (this.#pageMap.get(name));
    // }

    get(name) {
        return (this.#pageMap.get(name));
    }


    async load(name) {
        if (!this.#pageMap.get(name) && !(await AppControl.fetchApp(name))) {
            console.log(`Could not load the page: ${name}`);
            return ;
        }
        let page = this.#pageMap.get(name);
        if (!page) {
            console.log("not page")
            return;
        }
        page.display("block");
        this.#onScreen.add(page);
        this.#currentPage = window.location.pathname;
    }

    async highlight(name) {
        this.#onScreen.forEach(page => {
            page.display("none");
        });
        this.#onScreen.clear();

        await AppControl.fetchElement(name);
        if (this.#pageMap.get(name)) {
            console.log("passed fetch app");
            this.load(name);
        }
        else {
            console.log("page " + this.#pageMap.get(name));
            // this.load("/");
            console.log(`The page ${name} does not exist`);
        }
        if (window.location.pathname !== name)
            history.pushState({name: name}, '', name);
    }

    async urlLoad(name) {
        this.#onScreen.forEach(page => {
            page.display("none");
        });
        this.#onScreen.clear();
        // this.#pageMap.clear();
    
        if (this.#pageMap.get(name) || (await AppControl.fetchApp(name))) {
            console.log("passed fetch app");
            this.load(name);
        }
        else {
            console.log("page " + this.#pageMap.get(name));
            // this.load("/");
            console.log(`The page ${name} does not exist`);
        }
        if (window.location.pathname !== name)
            history.pushState({name: name}, '', name);
    }
    

    unload(name) {
        let page = this.#pageMap.get(name);

        if (!page) {
            if (name)
                console.log(`Could not unload the page: ${name}`);
            return ;
        }
        page.display("none");
        this.#onScreen.delete(page);
    }

    forEach(callback) {
        this.#pageMap.forEach((value, key, map) => {
            callback(value, key, map);
        });
    }
}

// setCurrent(page) {
    //     history.pushState({page: page}, '', page);
    //     this.#currentPage = window.location.pathname;
    // }

    // clearScreenOnLoad(caller) {
    //     if (!this.#pageMap.get(caller).isOnScreen())
    //         return ;
    //     this.#onScreen.forEach(page => {
    //         if (caller === page.name) return ;
    //         page.display(false);
    //     });
    //     this.#onScreen.clear();
    // }