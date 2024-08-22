import { loginPage } from "../../pong/js/auxFts.js";
import { PageManager } from "./PageManager.js";

// await loginPage();

let fullPath = window.location.pathname + window.location.search;
export const views = new PageManager(fullPath);

// console.log("app start " + fullPath);

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('popstate', () => {
        views.urlLoad(fullPath);
    });

    // views.urlLoad("/");
    views.urlLoad(fullPath);
});
