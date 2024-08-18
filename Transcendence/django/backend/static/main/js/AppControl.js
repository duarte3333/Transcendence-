import { views } from "./main.js";



export class AppControl {
    constructor() {}

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

   
    static async fetchApp(name) {
        try {
            name = "/" + name.replace(/^\/+/, "");
            console.log("@@@@");
            console.log(name);
            console.log("@@@@");
            // let find = "api" + name;
            let find = "https://localhost/spa" + name;
            console.log(`fetching= ${find} `);
            const response = await fetch(find);
            console.log("Estouuuu aquiiiiiiiiiiiiiiiii");
            if (!response.ok)
                throw new Error('Network response was not ok: ' + response.statusText);
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
            console.log("----------------");
            console.log(find);
            if (find == "footer/")
                console.log(appHtml);
            console.log("----------------");
            await this.#executeScript(newdiv);
            // const fetched = views.get(name);
            // if (fetched)
            // await views.waitFetch(name);
            views.get(name).setHtml(newdiv);
            return (views.get(name));
        } catch (error) {
            console.error('Error:', error);
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
