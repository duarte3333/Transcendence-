import { PageManager } from "./PageManager.js";

export let views = new PageManager(window.location.pathname);

console.log("app start." + window.location.pathname);

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('popstate', () => {
        console.log("app start2." + window.location.pathname);
        views.urlLoad(window.location.pathname);
    });
   
    console.log("url first load." + window.location.pathname);
    views.urlLoad(window.location.pathname);
});
