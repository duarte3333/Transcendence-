export async function getUser() {
	return await fetch('/api/user-info/')
    .then(async (response) => {return await response.json()})
    .catch(error => console.error('Error:', error));
}