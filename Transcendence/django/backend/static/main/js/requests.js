document.getElementById("requestButton").addEventListener("click", function() {
    const data = {
        field: "username",
        username: document.getElementById("username").value
    };
    fetch('api/requestUser/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json()) 
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    });