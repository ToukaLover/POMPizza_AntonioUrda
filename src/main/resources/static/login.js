document.addEventListener("DOMContentLoaded", function () {
    // Asegurar que el formulario existe antes de añadir el listener
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            const authRequest = { username, password };

            try {
                const response = await fetch("http://localhost:8080/auth/generateToken", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(authRequest),
                });

                if (!response.ok) {
                    throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`);
                }

                const token = await response.text();

                if (token) {
                    localStorage.setItem("jwtToken", token);

                    try {
                        const payload = JSON.parse(atob(token.split(".")[1]));
                        const userRole = payload.role;

                        console.log("Usuario autenticado con rol:", userRole);

                        alert("Login exitoso!");

                       window.location.href = "/pizzas";

                    } catch (error) {
                        console.error("Error al decodificar el token:", error);
                        alert("Error en la autenticación.");
                    }
                } else {
                    alert("Usuario o contraseña incorrectos");
                }
            } catch (error) {
                console.error("Error en el login:", error);
                alert("Ocurrió un error durante el login. Por favor, intenta de nuevo.");
            }
        });
    }

    checkAuthStatus();
});

// Función para verificar si el usuario está autenticado
function checkAuthStatus() {
    const token = localStorage.getItem("jwtToken");

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const userRole = payload.role;

            console.log("Rol del usuario:", userRole);

            const adminPanel = document.getElementById("adminPanel");
            if (adminPanel) {
                adminPanel.style.display = userRole === "ROLE_ADMIN" ? "block" : "none";
            }

        } catch (error) {
            console.error("Error al decodificar el token:", error);
            localStorage.removeItem("jwtToken");
        }
    }
}
