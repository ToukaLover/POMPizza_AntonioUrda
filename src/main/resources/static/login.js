document.addEventListener("DOMContentLoaded", function () {
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

                const tokens = await response.json();
                const accessToken = tokens.accessToken;
                const refreshToken = tokens.refreshToken;

                if (accessToken && refreshToken) {
                    // Guarda ambos tokens en localStorage y en cookies
                    localStorage.setItem("jwtToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    setCookie("jwtToken", accessToken, 7);
                    setCookie("refreshToken", refreshToken, 7);

                    try {
                        const payload = JSON.parse(atob(accessToken.split(".")[1]));
                        const userRole = payload.role;
                        console.log("Usuario autenticado con rol:", userRole);

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

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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

function checkAuthStatus() {
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
        adminPanel.style.display = userRole === "ADMIN" ? "block" : "none";
    }
}

// Función para refrescar el access token cuando sea necesario
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken") || getCookie("refreshToken");
    console.log("Intentando refrescar token con refreshToken:", refreshToken);
    if (!refreshToken) {
        window.location.href = "/login";
        return;
    }
    try {
        const response = await fetch("http://localhost:8080/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });
        if (response.ok) {
            const data = await response.json();
            const newAccessToken = data.accessToken;
            console.log("Nuevo accessToken obtenido:", newAccessToken);
            localStorage.setItem("jwtToken", newAccessToken);
            setCookie("jwtToken", newAccessToken, 7);
            return newAccessToken;
        } else {
            console.error("Error al refrescar token. Status:", response.status);
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Error al refrescar token:", error);
        window.location.href = "/login";
    }
}
