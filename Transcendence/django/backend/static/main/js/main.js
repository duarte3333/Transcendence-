import { PageManager } from "./PageManager.js";

export let views = new PageManager(window.location.pathname);

console.log("app start.");

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('popstate', () => {
        console.log("app start2.");
        views.urlLoad(window.location.pathname);
    });
   
    views.urlLoad(window.location.pathname);
});
