import { Page } from "./Page.js";
import { AppControl } from "./AppControl.js";
import { getCookie, loginPage } from "../../pong/js/auxFts.js"; 


export class PageManager {
    #pageMap;
    #onScreen;
    #onDom;
    #currentPage;
    props = {}

    constructor(current) {
        this.#pageMap = new Map();  
        this.#onScreen = new Set();
        this.#onDom = new Set();
        this.#currentPage = "current";
    }

    setElement(name, displayFunction, events) {
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
        // console.log("getting view " + name);
        // while (!this.#pageMap.get(name))
        //     ;
        return (this.#pageMap.get(name));
    }

    show(name) {
        const page = this.#pageMap.get(name);
        if (!page) {
            console.log("not page")
            return ;
        }
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
        if (document.querySelector(`[page="${element}"]`)) {
            return;
        }
    
        let page = this.get(element);
    
        if (!page.getHtml()) {
            console.log("trying to load not existing html " + element);
        } else {
            const htmlElement = page.getHtml();
            
            // console.log("element ==> ", element);
            if (element === '/navbar') {
                document.body.prepend(htmlElement); // Insert navbar as the first child
            } else if (element === '/footer') {
                document.body.append(htmlElement); // Insert footer as the last child
            } else {
                document.body.appendChild(htmlElement); // Insert other elements normally
            }
    
        }
    
        this.#onDom.add(element);
    }
    
    #domUnload(element) {
        if (!document.querySelector(`[page="${element}"]`)) {
            console.log("domUnload failed " + element);
            return ;
        }
        // console.log("domUnload success" + element);
        const page = this.#pageMap.get(element);
        page.display("none");
        page.getHtml().remove();
        // document.body.removeChild(page.getHtml());
        this.#onDom.delete(page);
    }
    async waitFetch(name) {
        while (!this.#pageMap.get(name)) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async urlLoad(name) {
        await loginPage();
        const nameOrigin = name;
        const urlParams = new URLSearchParams(name.split("?")[1]);
        name =  name.split("?")[0];
        //Para users nao estando logged in conseguirem ir po resto
        if (name != "/" && window.user == undefined)
        {
            this.urlLoad('/');
            return;
        }
        this.props = {};

        
        urlParams.forEach((value, key) => {
            this.props[key] = value;
        });
        for (const page of this.#onDom) {
            this.#domUnload(page);
        }
        this.#onScreen.clear();
    
        let child;
        let familyTree = [name];
        while (child = familyTree.pop()) {
            if (!this.#pageMap.get(child) && !(await AppControl.fetchApp(child))) {
                console.log(`The page ${child} does not exist`);
                return ;
            }
            this.#domLoad(child);
            if (child == name)
                familyTree = [...this.get(name).getFamilyTree()];
        }
        if (window.location.pathname !== nameOrigin)
            history.pushState({name: nameOrigin}, '', nameOrigin);
        this.show(name);
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