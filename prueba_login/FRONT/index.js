const API_URL = "http://localhost:3000/api/login";

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    });
}
