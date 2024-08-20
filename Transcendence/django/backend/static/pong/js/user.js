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
            return data.user.friends;
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}

export async function addFriend(friendDisplayName) {
    try {
        const response = await fetch('api/user/addFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: new URLSearchParams({
                'friend_display_name': friendDisplayName
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Success:', data.message);
        } else {
            console.error('Error:', data.message);
        }
        return data;
    } catch (error) {
        console.error('Request failed:', error);
    }
}


export async function updateUserProfile(updatedFields) {
	const url = 'api/user/profile/update';

	// Create a FormData object to handle file uploads and other fields
	const formData = new FormData();

	// Append each field in updatedFields to the FormData object
	for (const key in updatedFields) {
		if (updatedFields.hasOwnProperty(key)) {
			formData.append(key, updatedFields[key]);
		}
	}

	try {
		const response = await fetch(url, {
			method: 'POST', // The request method
			headers: {
				'X-CSRFToken': getCookie('csrftoken'), // CSRF token for security
			},
			body: formData // The body of the request as FormData
		});

		if (!response.ok) {
            // Attempt to parse error details from the response body
            let errorMessage = 'An unknown error occurred';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If parsing fails, fallback to default error message
                errorMessage = 'Failed to parse error response';
            }
            
            alert(errorMessage);
            throw new Error(`Backend error: ${response.status}`);
        }

		const data = await response.json(); // Parse the JSON response
		window.user = data.user;
		console.log("data user === ", data.user);
		return data; // Return the parsed data

	} catch (error) {
		console.error('Error updating user profile:', error);
		throw error; // Re-throw the error for handling elsewhere
	}
}