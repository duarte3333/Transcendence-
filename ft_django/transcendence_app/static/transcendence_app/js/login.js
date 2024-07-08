import { AppControl } from "./AppControl.js";
import { PageMap } from "./PageMap.js";

let pages = new PageMap()

pages.set("login", function() {
    return ;
})

pages.set("register", function() {
    return ;
})

pages.set("/", function() {
    AppControl.bodyDisplay("login-body");
    return ;
})

pages.set("/home/", function() {
    AppControl.bodyDisplay("home-body");
    document.getElementById("chat-body").style.display = '';
    return ;
})

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

document.addEventListener("DOMContentLoaded", function() {
    history.replaceState({url: window.location.pathname}, '', window.location.pathname);

    pages.load(window.location.pathname);

    document.getElementById("login_B").addEventListener("click", function() {
        fetch("http://127.0.0.1:8000/api/login/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success === true) {
                    pages.load('/home/');
                    history.pushState({"home": "home"}, '', "/home/");
                } else {
                    console.log(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    document.getElementById("register_B").addEventListener("click", function() {
        fetch("http://127.0.0.1:8000/api/register/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    window.addEventListener('popstate', function(event) {
        pages.load(window.location.pathname);
    });

    document.getElementById('send-button').addEventListener('click', function(event) {
        document.getElementsByClassName("chat")[0].style.display = "none";
    });

    // document.getElementById('loginForm').addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     const username = document.getElementById('username').value;
    //     const password = document.getElementById('password').value;

    //     const payload = {
    //         username: username,
    //         password: password,
    //     };

    //     fetch('/login/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': getCookie('csrftoken')
    //         },
    //         body: JSON.stringify(payload)
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             const responseMessage = document.getElementById('responseMessage');
    //             if (data.success)
    //                 responseMessage.innerHTML = 'Login successful!';
    //             else
    //                 responseMessage.innerHTML = `Login failed: ${data.message}`;
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    // });
});

    // function loadPage(url, stateUrl) {
    //     fetch(url)
    //         .then(async(response) => {
    //             if (!response.ok) {
    //                 loadPage("");
    //                 throw new Error("Not a valid URL.");
    //             }
    //             bodyContainer.innerHTML = await response.text();
    //             history.pushState({url: url}, '', stateUrl);
    //         })
    //         .catch(error => console.error('Error loading page:', error));
    // }

    // window.onpopstate = function(event) {


// guest
// GuestUser!
// function showPage(pageId) {
//     const pages = document.querySelectorAll('.page');
//     pages.forEach(page => {
//         page.style.display = 'none';
//     });
//     document.getElementById(pageId).style.display = 'block';
//     console.log('here');
// }

// function hidePage() {
//     const pages = document.querySelectorAll(".spa");
//     pages.forEach(page => {
//         page.remove();
//     });
//     document.getElementById(pageId).style.display = 'block';
//     console.log('here');
// }

// function    deleteDiv(name) {
//     var divToDelete = document.getElementById(name);
//     if (divToDelete) {
//         divToDelete.remove();
//         console.log('Div deleted');
//     } else {
//         console.log('Div not found');
//     }
// }

// document.getElementById("button-load-home").addEventListener('click', function() {
//     hidePage();
// })

// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("button-load-home").addEventListener("click", function() {
//         fetch('main-page')
//             .then(response => response.text())
//             .then(data => {
//                 document.getElementById('main-body').innerHTML = data;
//             })
//             .catch(error => console.error('Error loading home-page.html:', error));
//     });
// });