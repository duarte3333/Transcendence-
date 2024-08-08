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
        let success = await fetch('api' + name).then(app => {
            if (!app.ok)
                throw new Error('Network response was not ok: ' + app.statusText);
            app.text();
        })
        .then(app => {
            const newdiv = document.createElement('div');
            newdiv.innerHTML = app;
            newdiv.id = name;
            newdiv.style.display = 'none';
            document.body.appendChild(newdiv);
            this.#executeScript(newdiv)
            return (true);
        })
        .catch(error => {
            console.error('Error:', error);
            return (false);
        })
        return (success);
    }

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
                script.parentNode.removeChild(script);
            });
        });
        return (await Promise.all(scriptPromises));
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
