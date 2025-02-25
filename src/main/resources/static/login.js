// Manejo del formulario de login
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validar campos antes de enviar
    if (!username || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear el objeto de la solicitud
    const authRequest = {
        username: username,
        password: password
    };

    try {

        // Enviar la solicitud POST al backend
        const response = await fetch("http://localhost:8080/auth/generateToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(authRequest)
        });

        // Verificar el código de estado
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.text();

        // Verificar si el token está presente
        if (data) {
            // Guardar el token en localStorage
            localStorage.setItem("jwtToken", data);
            alert("Login exitoso!");
            // Redirigir al index
            window.location.href = "/pizzas";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    } catch (error) {
        console.error("Error en el login:", error);
        alert("Ocurrió un error durante el login. Por favor, intenta de nuevo.");
    }
});