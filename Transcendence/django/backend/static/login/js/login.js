import { AppControl } from "../../main/js/AppControl.js";
import { views } from "../../main/js/main.js"

function secureElement(element) {
    var found = document.getElementById(element);
    if (found)
        return (found);
    console.log(element + "Not found");
    return (document.createElement("div"));
}

views.setElement("/", (state) => {
    secureElement("login-body").style.display = state;
})
.setEvents(
    ["login_B", "click", () => {views.urlLoad("/home/")}],
    ["register_B", "click", () => registerLoad()]
);

function registerLoad() {
    const loginBody = document.getElementById("login-body")
    if (loginBody) {
        loginBody.setAttribute("style", "display: none !important;");
    }
    const registerBody = document.getElementById("registerBody")
    if (registerBody) {
        registerBody.setAttribute("style", "display: flex !important;");
    }
}

