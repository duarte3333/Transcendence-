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
        var element = this.fetchFromServer(name);
        if (element == null)
            return (false);
        console.log("fetchElement passed if.");
        document.body.appendChild(element);
        return (true);
    }

    static async fetchApp(name) {
        var app = await this.fetchFromServer(name);
        if (app == null) {
            console.log("failed fetch");
            return (false);
        }
        else {
            console.log("app " + app);
        }
        console.log("fetchApp passed if.");
        document.body.innerHTML = app;
        return new Promise((resolve, reject) => {
            const scripts = document.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                    newScript.type = script.type;  // If script has a type (like module)
                    script.onload = () => {
                        console.log("Script loaded successfully.");
                        resolve(true);
                    };
                    script.onerror = () => {
                        console.log("Failed to load the script.");
                        reject(false);
                    };
                    document.head.appendChild(newScript);
                } else {
                    newScript.textContent = script.textContent;
                    document.body.appendChild(newScript);
                }
            });
        });
        // return new Promise((resolve, reject) => {
        //     let script = document.createElement('script');
        //     script.type = 'module';
        //     script.src = '/static/login/js/login.js';
        //     script.onload = () => {
        //         console.log("Script loaded successfully.");
        //         resolve(true);
        //     };
        //     script.onerror = () => {
        //         console.log("Failed to load the script.");
        //         reject(false);
        //     };
        //     document.body.appendChild(script);
        // });
    }

    static async fetchFromServer(name) {
        try {
            const response = await fetch("api/login/", { // Update to your desired endpoint
                method: 'GET'
            });
            console.log("after fetch");
            return (await response.text());
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
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
