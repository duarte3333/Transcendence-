import { loginPage } from "../../pong/js/auxFts.js";
import { PageManager } from "./PageManager.js";

// await loginPage();
export const views = new PageManager(window.location.pathname);

// console.log("app start " + window.location.pathname);

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('popstate', () => {
        views.urlLoad(window.location.pathname);
    });

    // views.urlLoad("/");
    views.urlLoad(window.location.pathname);
});
