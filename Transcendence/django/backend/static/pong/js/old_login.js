document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('uname').value;
    const password = document.getElementById('psw').value;

    const loginData = {
        username: username,
        password: password,
    };



    if (window.location.href === 'http://127.0.0.1:8000/')
        url = "http://127.0.0.1:8000/api/login/";
    else if (window.location.href === 'http://127.0.0.1:8000/register/')
        url = "http://127.0.0.1:8000/api/register/";

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        
        console.log('Success', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}