function obtenerRolUsuario() {

    try {
        const rol = JSON.parse(atob(localStorage.getItem("jwtToken").split(".")[1])).sub

        return rol;
    } catch (error) {
        window.location.href = `/auth/login`
        return null;
    }

}
async function renderPizzas() {
    try {
        const response = await fetch("http://localhost:8080/api/pizzas");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const pizzas = await response.json();
        const $tabla = document.getElementById("tablaPizzas");
        $tabla.innerHTML = "";

        // Obtener el rol del usuario autenticado
        const userRole = obtenerRolUsuario();
        console.log(userRole)
        const isAdmin = userRole === "admin";

        pizzas.forEach(pizza => {
            const $tr = document.createElement("tr");

            $tr.innerHTML = `
                <td>${pizza.nombre}</td>
                <td>${pizza.descripcion}</td>
                <td>
                    <ul>
                        ${pizza.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join("")}
                    </ul>
                </td>
                <td>${pizza.precio}</td>
                <td>
                    <img src="${pizza.imagenUrl}" alt="${pizza.nombre}" width="100">
                </td>
                <td>${pizza.disponible ? 'Sí' : 'No'}</td>
                ${isAdmin ? `
                    <td>
                        <a href="/admin/pizzas/editar/${pizza.id}">Editar</a>
                        <button onclick="Eliminar('${pizza.id}')">Eliminar</button>
                    </td>
                ` : ""}
            `;

            $tabla.appendChild($tr);


        });

        const $a = document.createElement("a")
        $a.href = "/admin/pizzas/nueva"
        $a.innerHTML = "Agregar Pizza"
        const $div = document.getElementById("div1")
        {
            isAdmin ?
                $div.appendChild($a)
                : ""
        }
        // Ocultar el encabezado "Acciones" si el usuario no es admin
        if (!isAdmin) {
            document.getElementById("thAcciones").style.display = "none";
        }

    } catch (error) {
        console.error("Error al obtener las pizzas:", error);
    }

}

async function Eliminar(id) {
    console.log("Eliminando pizza con ID:", id);

    try {
        const response = await fetch(`http://localhost:8080/api/pizzas/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la pizza: ${response.status}`);
        }

        console.log(`Pizza con ID ${id} eliminada exitosamente`);

        // Volver a renderizar la tabla después de eliminar
        renderPizzas();

    } catch (error) {
        console.error("Error al eliminar la pizza:", error);
    }
}

// Ejecuta la función para renderizar las pizzas al cargar la página
renderPizzas();
