export class AppControl {
    constructor() {}

    static bodyDisplay(tagName) {
        document.querySelectorAll('body > *').forEach(element => {
            element.style.display = 'none';
        });
    
        document.getElementById(tagName).style.display = 'block';
    }
}