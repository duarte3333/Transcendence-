// import { AppControl } from "../../main/js/AppControl.js";
import { views } from "../../main/js/main.js"

console.log("main script");

function secureElement(element) {
    var found = document.getElementById(element);
    if (found)
        return (found);
    console.log(element + "Not found");
    return (new document.createElement("div"));
}

views.setElement("/", (state) => {
    // views.get("/navbar/").display(state);
    secureElement("login-body").style.display = state;
})
// .setChilds(["/navbar/"])
.setEvents(
    ["login_B", "click", () => views.urlLoad("/home/")],
    ["register_B", "click", () => views.urlLoad("/settings/")]
);

views.setElement("/register/", (state) => {
    secureElement("register-body").style.display = state;
})
.setEvents(
    ["chat_button", "click", () => {views.load("chat")}]
);
