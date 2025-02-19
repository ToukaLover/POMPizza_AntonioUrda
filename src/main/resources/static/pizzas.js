async function renderPizzas() {
    try {
        // Realiza la petición a la API
        const response = await fetch("http://localhost:8080/api/pizzas");

        // Verifica que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // Convierte la respuesta a JSON
        const pizzas = await response.json();

        // Selecciona la tabla y limpia su contenido
        const $tabla = document.getElementById("tablaPizzas");
        $tabla.innerHTML = "";  // Limpia la tabla antes de volver a llenarla

        // Itera sobre cada pizza y crea una fila en la tabla
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
                <td id="acciones">
                    <a href="/pizzas/editar/${pizza.id}">Editar</a>
                    <button onclick="Eliminar('${pizza.id}')">Eliminar</button>
                </td>
            `;

            $tabla.appendChild($tr);
        });

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
