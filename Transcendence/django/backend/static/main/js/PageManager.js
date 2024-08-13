import { Page } from "./Page.js";
import { AppControl } from "./AppControl.js";

export class PageManager {
    #pageMap;
    #onScreen;
    #onDom;
    #currentPage;

    constructor(current) {
        this.#pageMap = new Map();
        this.#onScreen = new Set();
        this.#onDom = new Set();
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

    get(name) {
        console.log("getting view " + name);
        return (this.#pageMap.get(name));
    }

    show(name) {
        const page = this.#pageMap.get(name);
        if (!page) {
            console.log("not page")
            return ;
        }
        console.log("loading " + name);
        page.display("block");
        this.#onScreen.add(page);
        this.#currentPage = window.location.pathname;
    }

    async preLoad(name) {
        if (this.#pageMap.get(name))
            return (this.#pageMap.get(name));
        if (!this.#pageMap.get(name) && !(await AppControl.fetchApp(name))) {
            console.log(`Could not load the page: ${name}`);
            return ;
        }
        if (!this.#pageMap.get(name)) {
            console.log("not page")
            return;
        }
    }

    #domLoad(element) {
        console.log("trye appending " + element);

        if (document.querySelector(`[page="${element}"]`))
            return ;
        const page = this.#pageMap.get(element);
        console.log("appending " + element);
        document.body.appendChild(page.getHtml());
        this.#onDom.add(page);
    }

    async urlLoad(name) {
        for (const page of this.#onScreen) {
            page.display("none");
            document.body.removeChild(page.getHtml());
        }
        this.#onScreen.clear();
    
        document.body.innerHTML = "";
        let child;
        let familyTree = [name];
        while (child = familyTree.pop()) {
            if (!this.#pageMap.get(child) && !(await AppControl.fetchApp(child))) {
                console.log(`The page ${child} does not exist`);
                return ;
            }
            this.#domLoad(child);
            if (child == name)
                familyTree = [...this.#pageMap.get(name).getFamilyTree()];
        }
        this.show(name);
        if (window.location.pathname !== name)
            history.pushState({name: name}, '', name);
    }

    hide(name) {
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


    // async highlight(name) {
    //     this.#onScreen.forEach(page => {
    //         page.display("none");
    //     });
    //     this.#onScreen.clear();

    //     await AppControl.fetchElement(name);
    //     if (this.#pageMap.get(name)) {
    //         console.log("passed fetch app");
    //         this.load(name);
    //     }
    //     else {
    //         console.log("page " + this.#pageMap.get(name));
    //         // this.load("/");
    //         console.log(`The page ${name} does not exist`);
    //     }
    //     if (window.location.pathname !== name)
    //         history.pushState({name: name}, '', name);
    // }

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