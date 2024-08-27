import { loginPage } from "../../pong/js/auxFts.js";
import { PageManager } from "./PageManager.js";

// await loginPage();

let fullPath = window.location.pathname + window.location.search;
let host = window.location.protocol + "//" + window.location.host;
window.hostUrl = host;
export const views = new PageManager(fullPath);

// console.log("app start host=", window.hostUrl);

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('popstate', () => {
        views.urlLoad(fullPath);
    });

    // views.urlLoad("/");
    views.urlLoad(fullPath);
});
