document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar inputs después de que el DOM esté listo
    const idInput = document.getElementById("id");
    const nombreInput = document.getElementById("nombre");
    const descripcionInput = document.getElementById("descripcion");
    const ingredientesInput = document.getElementById("ingredientes");
    const precioInput = document.getElementById("precio");
    const imagenUrlInput = document.getElementById("imagenUrl");
    const disponibleSelect = document.getElementById("disponible");

    const formulario = document.getElementById("formEditarPizza");

    formulario.addEventListener("submit", editarPizza);
    ponerCampos(); // Llamar a la función después de definir los inputs

    async function editarPizza(event) {
        event.preventDefault(); // Evita la recarga de la página

        const pizzaEditada = {
            id:idInput.value,
            nombre: nombreInput.value,
            descripcion: descripcionInput.value,
            ingredientes: ingredientesInput.value.split(",").map(ing => ing.trim()),
            precio: parseFloat(precioInput.value),
            imagenUrl: imagenUrlInput.value,
            disponible: disponibleSelect.value === "true"
        };

        console.log(pizzaEditada);

        try {
            const response = await fetch(`http://localhost:8080/api/pizzas/editar/${pizzaEditada.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pizzaEditada)
            });

            if (!response.ok) {
                throw new Error(`Error en la respuesta de la API: ${response.status}`);
            }

            const data = await response.json();
            console.log("Pizza editada con éxito:", data);

            // Limpiar formulario
            formulario.reset();
        } catch (error) {
            console.error("Error al editar la pizza:", error);
        }
    }

    async function ponerCampos() {
        const parts = window.location.pathname.split("/");
        const id = parts[parts.length - 1]; // Última parte de la URL
        console.log("ID obtenido de la URL:", id);
        
        try {
            const response = await fetch(`http://localhost:8080/api/pizzas/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error al obtener la pizza: ${response.status}`);
            }

            const pizza = await response.json();
            console.log("Pizza obtenida:", pizza);
            
            idInput.value = pizza.id;
            nombreInput.value = pizza.nombre;
            descripcionInput.value = pizza.descripcion;
            ingredientesInput.value = pizza.ingredientes.join(", ");
            precioInput.value = pizza.precio;
            imagenUrlInput.value = pizza.imagenUrl;
            disponibleSelect.value = pizza.disponible ? "true" : "false";

        } catch (error) {
            console.error("Error al cargar los datos de la pizza:", error);
        }
    }
});
