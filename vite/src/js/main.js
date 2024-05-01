// Import our custom CSS
import "../scss/styles.scss";

// Import only the Bootstrap components we need
import { Popover } from "bootstrap";

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popover) => {
  new Popover(popover);
});

export function test2() {
  console.log("aqui");
}
//create a botton for id="boas"
document.addEventListener("DOMContentLoaded", (event) => {
  const boasButton = document.getElementById("boas");
  if (boasButton) {
    boasButton.addEventListener("click", function () {
      console.log("Boas");
    });
  }
});

document.addEventListener("DOMContentLoaded", (event) => {
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      //check if the user is named "admin" and the password is "admin"
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      if (username !== "admin" || password !== "admin") {
        alert("Invalid credentials");
        return;
      }
      window.location.href = "home.html";
    });
  }
});
