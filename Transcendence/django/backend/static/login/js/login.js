// import { AppControl } from "../../main/js/AppControl.js";
import { views } from "../../main/js/main.js"
import { loginPage } from "../../pong/js/auxFts.js";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function secureElement(element) {
    var found = document.getElementById(element);
    if (found)
        return (found);
    return (document.createElement("div"));
}

views.setElement("/", (state) => {
    if (state == "block" && window?.user != undefined) {
        views.urlLoad("/home")
    }
    else
    // views.get("/navbar/").display(state);
    secureElement("login-body").style.display = state;
})
// .setChilds(["/navbar/"])
.setEvents(
    ["login_B", "click", () => loginPost()],
    ["register_B", "click", () => registerLoad()],
    ["registerFinal", "click", () => registerPost()],
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
    const errors = document.getElementById("errors");
    errors.style.display = "none";

}


function loginPost() {
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    const data = {
        username: username.value,
        password: password.value,
    }
    fetch('api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (!response.ok) {
          
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Network response was not ok.');
            });
        }
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            return response.json();
        } else {
            throw new Error('Response is not a valid JSON');
        }
        
    })
    .then(async (data) => {
        await loginPage();
        const registerBody = document.getElementById("registerBody")
        if (registerBody) {
            registerBody.setAttribute("style", "display: none !important;");
        }
        views.urlLoad("/home")
        // Handle successful registration here (e.g., redirect user or show success message)
    })
    .catch(error => {
        // console.error('Error:', error);
        const errorMessage = error.message.replace(/^Error:\s*/, '');
        const errors = document.getElementById("errorsLogin");
        errors.style.display = "block";
        errors.innerText = errorMessage;
        // Handle error here (e.g., show an error message to the user)
    });
}

function registerPost() {
    const username = document.getElementById("usernameR");
    const displayName = document.getElementById("displayNameR");
    const password = document.getElementById("passwordR");
    //add parse

    const data = {
        username: username.value,
        displayName: displayName.value,
        password: password.value,
    }

    fetch('api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Network response was not ok.');
            });
        }
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            return response.json();
        } else {
            throw new Error('Response is not a valid JSON');
        }
    })
    .then(data => {
        console.log('Success:', data);
        const registerBody = document.getElementById("registerBody")
        if (registerBody) {
            registerBody.setAttribute("style", "display: none !important;");
        }
        views.urlLoad("/")
        // Handle successful registration here (e.g., redirect user or show success message)
    })
    .catch(error => {
        // console.error('Error:', error);
        const errorMessage = error.message.replace(/^Error:\s*/, '');
        const errors = document.getElementById("errors");
        errors.style.display = "block";
        errors.innerText = errorMessage;
        // Handle error here (e.g., show an error message to the user)
    });
}


