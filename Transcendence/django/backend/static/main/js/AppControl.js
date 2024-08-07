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

    static  fetchElement(name) {
        let success = this.fetchFromServer('api' + name).then(element => {
            if (element == null) 
                return (false);
            document.body.appendChild(element);
            return (this.executeScript().then(() => true));
        }).catch(error => {
            console.error('Error:', error);
            return (false);
        }); 
        return (success);
    }

    // static async fetchApp(name) {
    //     let success = this.fetchFromServer('api' + name).then(app => {
    //         if (app == null) 
    //             return (false);
    //         // document.body.innerHTML = app;
    //         document.body.appendChild(await app.text());
    //         return (this.executeScript().then(() => {
    //             // this.#removeAllScripts();
    //             return (true);
    //         }));
    //     }).catch(error => {
    //         console.error('Error:', error);
    //         return (false);
    //     });
    //     return (success);
    // }

    // static async fetchApp(name) {
    //     console.log("fetching");
    //     let success = await fetch('api' + name)
    //         .then(app => app.text())
    //         .then(app => {
    //             const newdiv = document.createElement('div');
    //             newdiv.innerHTML = app;
    //             newdiv.id = name;
    //             this.executeScript(newdiv);
    //             document.body.appendChild(newdiv);
    //             return (true);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             return (false);
    //         });
    //     return (success);
    // }

    // static async fetchApp(name) {
    //     console.log("fetching " + name);
    //     return (
    //         await fetch('api' + name)
    //         .then(app => app.text())
    //         .then(app => {
    //             const newdiv = document.createElement('div');
    //             newdiv.innerHTML = app;
    //             newdiv.id = name;
    //             document.body.appendChild(newdiv);
    //             return (newdiv);
    //         })
    //         .then(newdiv => this.executeScript(newdiv))
    //         .then(() => {return true})
    //         .catch(error => {
    //             console.error('Error:', error);
    //             return (false);
    //         })
    //     );
    // }

    static async fetchApp(name) {
        console.log("fetching " + name);
        try {
            const response = await fetch('api' + name);
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            const app = await response.text();
            const newdiv = document.createElement('div');
            newdiv.innerHTML = app;
            newdiv.id = name;
            document.body.appendChild(newdiv);
            
            await this.executeScript(newdiv);
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }


    static async executeScript(doc) {
        console.log("begin execution" + doc.id);
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

    static register() {
        fetch("http://127.0.0.1:8000/api/register/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCookie('csrftoken')
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
    };
}
