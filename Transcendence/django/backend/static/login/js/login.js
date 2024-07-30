import { AppControl } from "./AppControl.js";
import { PageManager } from "./PageManager.js";

let views = new PageManager(window.location.pathname);

function secureElement(element) {
    var found = document.getElementById(element);
    if (found)
        return (found);
    console.log(element + "Not found");
    return (new document.createElement("div"));
}

views.setElement("/", (state) => {
    secureElement("login-body").style.display = state;
})
.setEvents(
    ["login_B", "click", () => {views.urlLoad("/home/")}],
    ["register_B", "click", () => views.urlLoad("/register/")]
);

views.setElement("/register/", (state) => {
    secureElement("register-body").style.display = state;
})
.setEvents();

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('popstate', () => {
        views.urlLoad(window.location.pathname);
    });
    views.urlLoad(window.location.pathname);
});

// views.setElement("/home/", (state) => {
//     secureElement("home-body").style.display = state;
// })
// .setEvents(
//     ["chat_B", "click", () => views.load("chat")]
// );
// views.setElement("chat", (state) => {
//     secureElement("chat-body").style.display = state;
// })
// .setEvents(
//     ["send-button", "click", () => views.unload("chat")]
// );
