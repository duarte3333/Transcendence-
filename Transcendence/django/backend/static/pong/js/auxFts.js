// import { AppControl } from "../../main/js/AppControl";

export function sleep(us) {
    return new Promise(resolve => {
        setTimeout(() => {
            // Calculate remaining microseconds and wait in a busy loop
            const start = performance.now();
            while (performance.now() - start < us / 1000) {
                // Busy-wait loop to handle the remaining microseconds
            }
            resolve();
        }, Math.floor(us / 1000));
    });
}

export function getCookie(name) {
    let cookieValue = {};
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
    return cookieValue || {};
}

export function deleteCookie(name, path = '/', domain) {
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
    if (domain) {
        cookieString += `; domain=${domain}`;
    }
    document.cookie = cookieString;
}



export  async function loginPage(){
    if (window.user != undefined)
        return window.user;
    return await fetch(window.hostUrl + '/api/user/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
    })
    .then(async (response) => {
        if (response != undefined && response.ok)
        {
            try {
            const { user } = await response.json();
            window.user = user;
            console.log("user ====== " , window.user);
            return user;
            } catch {
                window.user = undefined;
            }
        }
        window.user = undefined;
    });
}