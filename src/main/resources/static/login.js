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
                    // Guarda el token en localStorage y en una cookie para que se envíe con las solicitudes de navegador
                    localStorage.setItem("jwtToken", token);
                    setCookie("jwtToken", token, 7);

                    try {
                        const payload = JSON.parse(atob(token.split(".")[1]));
                        const userRole = payload.role;
                        console.log("Usuario autenticado con rol:", userRole);

                        // Guarda el rol en una cookie por 7 días
                        setCookie("userRole", userRole, 7);

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

// Función para establecer una cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Función para obtener una cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Función para verificar si el usuario está autenticado
function checkAuthStatus() {
    // Intenta obtener el token de localStorage o de la cookie
    const token = localStorage.getItem("jwtToken") || getCookie("jwtToken");
    let userRole = getCookie("userRole");

    if (!userRole && token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            userRole = payload.role;
            setCookie("userRole", userRole, 7);
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            localStorage.removeItem("jwtToken");
        }
    }

    console.log("Rol del usuario:", userRole);

    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) {
        // Compara con "ADMIN" (sin prefijo) para que coincida con lo enviado desde el token
        adminPanel.style.display = userRole === "ADMIN" ? "block" : "none";
    }
}
