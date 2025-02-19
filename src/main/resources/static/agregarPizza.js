document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formAgregarPizza");

    formulario.addEventListener("submit", agregarPizza);

    const nombreInput = document.getElementById("nombre");
    const descripcionInput = document.getElementById("descripcion");
    const ingredientesInput = document.getElementById("ingredientes");
    const precioInput = document.getElementById("precio");
    const imagenUrlInput = document.getElementById("imagenUrl");
    const disponibleSelect = document.getElementById("disponible");

    async function agregarPizza(event) {
        event.preventDefault(); // Evita la recarga de la página
        
        const nuevaPizza = {
            nombre: nombreInput.value,
            descripcion: descripcionInput.value,
            ingredientes: ingredientesInput.value.split(",").map(ing => ing.trim()),
            precio: parseFloat(precioInput.value),
            imagenUrl: imagenUrlInput.value,
            disponible: disponibleSelect.value === "true"
        };

        console.log(nuevaPizza);

        try {
            const response = await fetch("http://localhost:8080/api/pizzas/agregar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevaPizza)
            });

            if (!response.ok) {
                throw new Error(`Error en la respuesta de la API: ${response.status}`);
            }

            const data = await response.json();
            console.log("Pizza agregada con éxito:", data);

            // Limpiar formulario
            formulario.reset();
        } catch (error) {
            console.error("Error al agregar la pizza:", error);
        }
    }
});
