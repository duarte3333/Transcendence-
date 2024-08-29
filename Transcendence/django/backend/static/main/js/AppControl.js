import { views } from "./main.js";



export class AppControl {

    static #logged = false;
    static url = window.hostUrl;
    static urlSocket = window.location.host;

    constructor() {
    }

    static bodyDisplay(tagName) {
        document.querySelectorAll('body > *').forEach(element => {
            element.style.display = 'none';
        });
        document.getElementById(tagName).style.display = 'block';
    }

    static getCookie(name) {
        let cookieValue = null;
    
        if (document.cookie && document.cookie !== '')
        {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++)
            {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return (cookieValue);
    }

    static async isLogged() {
        
        if (!this.#logged) {
            return Promise.resolve(false);
        }
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(window.hostUrl + '/api/user/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    const { user } = data;
                    window.user = user;
                    resolve(true);
                } else {
                    window.user = undefined;
                    resolve(false);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                window.user = undefined;
                resolve(false);  // or reject(error) if you want to propagate the error
            }
        });
    }
    
   
    static async fetchApp(name) {
        try {
            name = "/" + name.replace(/^\/+/, "");
            // let find = "api" + name;
            let find = window.hostUrl + "/spa" + name;
            const response = await fetch(find);

            if (!response.ok)
                throw new Error('Network response was not ok: ' + response.statusText);
            // console.log("appcontrol response =", response);
            const appHtml = await response.text();
            const element = document.querySelector(`[page="${name}"]`);
            
            let newdiv;
            if (element) {
                newdiv = element;
            } else {
                newdiv = document.createElement('div');
                newdiv.innerHTML = appHtml;
                newdiv.setAttribute("page", name);
            }
            // document.body.innerHTML = appHtml;
            await this.#executeScript(newdiv);
            // const fetched = views.get(name);
            // if (fetched)
            // await views.waitFetch(name);
            views.get(name).setHtml(newdiv);
            return (views.get(name));
        } catch (error) {
            console.error('Error:', error);
            views.urlLoad("/home");
            return (false);
        }
    }

    // static async fetchApp(name) {
    //     console.log(`fetching =${'api' + name} `);
    //     let success = await fetch("api/" + name).then(app => {
    //         if (!app.ok)
    //             throw new Error('Network response was not ok: ' + app.statusText);
    //         return (app.text());
    //     })
    //     .then(app => {
    //         const element = document.querySelector(`[page="${name}"]`);
    //         if (element)
    //             return (element);
    //         const newdiv = document.createElement('div');
    //         newdiv.innerHTML = app;
    //         newdiv.setAttribute("page", name);
    //         return (newdiv);
    //     })
    //     .then(async (newdiv) => {
    //         await this.#executeScript(newdiv);
    //         views.get(name).setHtml(newdiv);
    //     })
    //     .then(() => {
    //         return (views.get(name));
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         return (false);
    //     })
    //     return (success);
    // }

    static async #executeScript(doc) {
        const scripts = doc.querySelectorAll('script');
        const scriptPromises = Array.from(scripts).map(script => {
            return new Promise((resolve, reject) => {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.type = script.type;
                newScript.onload = resolve;
                newScript.onerror = reject;
                document.head.appendChild(newScript);
                // script.parentNode.removeChild(newScript);
            });
        });
        return (Promise.all(scriptPromises));
    }

}
// static register() {
//     fetch("http://127.0.0.1:8000/api/register/", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': this.getCookie('csrftoken')
//         },
//         body: JSON.stringify({
//             username: document.getElementById('username').value,
//             password: document.getElementById('password').value
//         })
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data.message);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// };
