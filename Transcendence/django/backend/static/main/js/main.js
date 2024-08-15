import { PageManager } from "./PageManager.js";

export const views = new PageManager(window.location.pathname);

// console.log("app start " + window.location.pathname);

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('popstate', () => {
        console.log("url listener" + window.location.pathname);
        views.urlLoad(window.location.pathname);
    });

    console.log("url first load." + window.location.pathname);
    // views.urlLoad("/");
    views.urlLoad(window.location.pathname);
});
