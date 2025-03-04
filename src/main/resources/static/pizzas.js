var pizzasPedido = []

// Función para obtener el rol del usuario desde el token JWT
function obtenerRolUsuario() {
    try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No hay token en localStorage");

        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role; // Asegurar que se usa el campo 'role'
    } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        window.location.href = "/auth/login";
        return null;
    }
}

function agregarPizzaAPedido(pizza){
    pizzasPedido = [...pizzasPedido,pizza]
    const tablaCarrito = document.getElementById("carrito")
    const $trCarrito = document.createElement("tr")
    $trCarrito.innerHTML=`
        <td>${pizza.nombre}</td>
        <td>${pizza.precio}</td>
    `
    tablaCarrito.appendChild($trCarrito)

}

async function renderPizzas() {

    try {
        const response = await fetch("http://localhost:8080/api/pizzas");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const pizzas = await response.json();
        const $tabla = document.getElementById("tablaPizzas");
        $tabla.innerHTML = ""; // Mantiene la tabla y la rellena de nuevo

        // Obtener el rol del usuario autenticado
        const userRole = obtenerRolUsuario();
        console.log("Rol del usuario:", userRole);
        const isAdmin = userRole === "ADMIN"; // Comprobar si es admin

        pizzas.forEach(pizza => {
            const $tr = document.createElement("tr");
            const $tdParaAgregar = document.createElement("td")
            
            const $button = document.createElement("button")
            $button.innerHTML="Agregar a Pedido"
            $button.onclick = () => agregarPizzaAPedido(
                {    
                    id:pizza.id,
                    nombre:pizza.nombre,      
                    precio:pizza.precio,
                }
            )
            $tdParaAgregar.appendChild($button)
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
            $tr.appendChild($tdParaAgregar)
            $tabla.appendChild($tr);
        });

        

        // Agregar el botón de "Agregar Pizza" solo si es admin
        const $div = document.getElementById("div1");

        const $botonPedido = document.getElementById("botonPedido")

        $botonPedido.onclick= (e) => agregarPedido(e)

        if (isAdmin) {
                const $enlace = document.createElement("a");
                $enlace.innerHTML="AgregarPizza"
                $enlace.href="/admin/pizzas/nueva"
                $div.appendChild($enlace);
            // Mostrar información del token en consola
            const token = localStorage.getItem("jwtToken");
            if (token) console.log("Token decodificado:", JSON.parse(atob(token.split(".")[1])));
        }

        // Ocultar el encabezado "Acciones" si el usuario no es admin
        if (!isAdmin) {
            document.getElementById("thAcciones").style.display = "none";
        }

    } catch (error) {
        console.error("Error al obtener las pizzas:", error);
    }
}

// Función para eliminar una pizza
async function Eliminar(id) {
    console.log("Eliminando pizza con ID:", id);

    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch(`http://localhost:8080/api/pizzas/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`, // Enviar token en eliminación
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la pizza: ${response.status}`);
        }

        console.log(`Pizza con ID ${id} eliminada exitosamente`);
        window.location.href = "/pizzas";

    } catch (error) {
        console.error("Error al eliminar la pizza:", error);
    }
}

// Función para obtener el cliente desde el token JWT
function obtenerClienteDesdeToken() {
    try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No hay token en localStorage");

        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub; // 'sub' es el identificador del usuario
    } catch (error) {
        console.error("Error al obtener el cliente:", error);
        window.location.href = "/auth/login";
        return null;
    }
}

// Función para calcular el total del pedido
function calcularTotal(pizzas) {
    return pizzas.reduce((total, pizza) => total + pizza.precio, 0);
}

// Función para agregar el pedido
async function agregarPedido(event) {
    event.preventDefault(); // Evita la recarga de la página

    const cliente = obtenerClienteDesdeToken();
    if (!cliente) return;

    if (pizzasPedido.length === 0) {
        alert("El pedido está vacío.");
        return;
    }

    // Construcción del objeto pedido
    const pedido = {
        cliente: cliente,
        pizzas: pizzasPedido,
        total: calcularTotal(pizzasPedido),
        fecha: new Date(),
        estado: "pendiente" // Estado inicial del pedido
    };

    try {
        const token = localStorage.getItem("jwtToken");

        console.log(pedido)

        const response = await fetch("http://localhost:8080/api/pedidos/agregar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Enviar el token para autenticación
            },
            body: JSON.stringify(pedido)
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta de la API: ${response.status}`);
        }

        const data = await response.json();
        console.log("Pedido agregado con éxito:", data);

        alert("Pedido realizado con éxito!");

        // Limpiar carrito después de enviar el pedido
        pizzasPedido = [];
        document.getElementById("carrito").innerHTML = "";

    } catch (error) {
        console.error("Error al agregar el pedido:", error);
    }
}

// Ejecuta la función para renderizar las pizzas al cargar la página
renderPizzas();
