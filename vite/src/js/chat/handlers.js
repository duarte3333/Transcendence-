
export function handleChatMessage(data) {
    let message = data.message;
    document.getElementById('messages').innerHTML += '<p>' + message + '</p>';
}
