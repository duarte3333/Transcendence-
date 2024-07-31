


export class AppControl {
    constructor() {}

    static bodyDisplay(tagName) {
        document.querySelectorAll('body > *').forEach(element => {
            element.style.display = 'none';
        });
        document.getElementById(tagName).style.display = 'block';
    }

    getCookie(name) {
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

    


    static login() {
        fetch("http://127.0.0.1:8000/api/login/", {
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
    };

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
