import { getCookie } from "./auxFts.js";

export async function getUser() {
	console.log("return user");
	return await fetch('/api/user-info')
    .then(async (response) => {return await response.json()})
    .catch(error => console.error('Error:', error));
}

export async function getUserFriends() {
    try {
        const response = await fetch('api/user/userFriends', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });

        const data = await response.json();
        if (response.ok) {
            // console.log('User friends:', data.user.friends);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}

export async function addFriend(friendUsername) {
    try {
        const response = await fetch('api/user/addFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie()
            },
            body: new URLSearchParams({
                'friend_username': friendUsername
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Success:', data.message);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}


export async function updateUserProfile(updatedFields) {
	
	const url = 'api/user/profile/update';

    try {
		const response = await fetch(url, {
			method: 'POST', // The request method
            headers: {
				'Content-Type': 'application/json', // The content type of the request body
                'X-CSRFToken': getCookie('csrftoken'), // CSRF token for security
            },
            body: JSON.stringify(updatedFields) // The body of the request, serialized as JSON
        });
		
        if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
        }
		
        const data = await response.json(); // Parse the JSON response
		window.user = data.user;
		console.log("data user === ", data.user);
		document.getElementById('displayName')
        return data; // Return the parsed data

    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error; // Re-throw the error for handling elsewhere
    }
}