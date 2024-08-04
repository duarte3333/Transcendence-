import { views } from "../../main/js/main.js"

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
.setEvents(
    ["chat_button", "click", () => {views.load("chat")}],

);
