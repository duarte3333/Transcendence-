export class PageMap {
    constructor() {
        this.pageMap = new Map();
    }

    set(name, lambdafunction) {
        if (typeof lambdafunction === 'function')
            this.pageMap.set(name, lambdafunction);
        else
            console.log(`The value set for ${name} is not a function`);
    }
  
    load(name) {
        let func = this.pageMap.get(name);

        if (typeof func === 'function') {
            func();
        }
        else
            console.log(`No function found for the page: ${name}`);
    }
}