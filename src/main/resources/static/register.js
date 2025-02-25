document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const userData = {
        name: document.getElementById('name').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        rol: document.getElementById('rol').value // Se recoge el valor del select
    };

    // Enviar los datos al backend utilizando Fetch API
    fetch('/auth/addNewUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        window.location.href = "/auth/login"; // Redirige a la página de login después del registro
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Hubo un error al registrar el usuario.");
    });
});