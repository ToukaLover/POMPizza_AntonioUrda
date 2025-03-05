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

// Función para renderizar los pedidos
async function renderPedidos() {
    try {
        const response = await fetch("http://localhost:8080/api/pedidos");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        var pedidos = await response.json();

        const $tabla = document.getElementById("tablaPedidos");
        $tabla.innerHTML = ""; // Limpia la tabla antes de llenarla

        // Obtener el rol del usuario autenticado
        const userRole = obtenerRolUsuario();
        console.log("Rol del usuario:", userRole);
        const isAdmin = userRole === "ADMIN"; // Comprobar si es admin
        const nombreCliente = obtenerClienteDesdeToken()

        if(!isAdmin){
            pedidos=pedidos.filter(pedido => pedido.cliente === nombreCliente)

            pedidos.forEach(pedido => {
                const $tr = document.createElement("tr");
    
                const pizzasLista = pedido.pizzas.map(p => `<li>${p.nombre} - €${p.precio}</li>`).join("");
    
                $tr.innerHTML = `
                    <td>${pedido.cliente}</td>
                    <td>
                        <ul>${pizzasLista}</ul>
                    </td>
                    <td>€${pedido.total.toFixed(2)}</td>
                    <td>${new Date(pedido.fecha).toLocaleString()}</td>
                    <td>${pedido.estado}</td>
                    ${isAdmin ? `
                        <td>
                            <button onclick="cambiarEstado('${pedido.id}')">Actualizar Estado</button>
                            <button onclick="eliminarPedido('${pedido.id}')">Eliminar</button>
                        </td>
                    ` : ""}
                `;
                $tabla.appendChild($tr);
            });

        }else{

            pedidos.forEach(pedido => {
                const $tr = document.createElement("tr");
    
                const pizzasLista = pedido.pizzas.map(p => `<li>${p.nombre} - €${p.precio}</li>`).join("");
    
                $tr.innerHTML = `
                    <td>${pedido.cliente}</td>
                    <td>
                        <ul>${pizzasLista}</ul>
                    </td>
                    <td>€${pedido.total.toFixed(2)}</td>
                    <td>${new Date(pedido.fecha).toLocaleString()}</td>
                    <td>${pedido.estado}</td>
                    ${isAdmin ? `
                        <td>
                            <button onclick="cambiarEstado('${pedido.id}')">Actualizar Estado</button>
                            <button onclick="eliminarPedido('${pedido.id}')">Eliminar</button>
                        </td>
                    ` : ""}
                `;
                $tabla.appendChild($tr);
            });

        }

        // Ocultar la columna de acciones si el usuario no es admin
        if (!isAdmin) {
            document.getElementById("thAcciones").style.display = "none";
        }

    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
    }
}

// Función para cambiar el estado de un pedido
async function cambiarEstado(id) {
    const nuevoEstado = prompt("Ingrese el nuevo estado (Pendiente, En preparación, Listo, Entregado):");
    if (!nuevoEstado) return;

    try {
        const token = localStorage.getItem("jwtToken");

        // Obtener el pedido completo antes de la actualización
        const pedidoResponse = await fetch(`http://localhost:8080/api/pedidos/${id}`);
        if (!pedidoResponse.ok) {
            throw new Error(`Error al obtener el pedido con ID ${id}: ${pedidoResponse.status}`);
        }
        const pedido = await pedidoResponse.json();

        // Actualizar el estado del pedido
        pedido.estado = nuevoEstado;

        // Enviar el pedido completo (incluido el estado actualizado) al backend
        const response = await fetch(`http://localhost:8080/api/pedidos/editar/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)  // Enviar todo el pedido con el estado actualizado
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el pedido: ${response.status}`);
        }

        const data = await response.json(); // Captura la respuesta del servidor
        console.log(`Pedido ${id} actualizado a estado ${nuevoEstado}`, data);

        // Volver a cargar la lista de pedidos después de actualizar
        renderPedidos(); 

    } catch (error) {
        console.error("Error al actualizar el pedido:", error);
    }
}


// Función para eliminar un pedido
async function eliminarPedido(id) {
    if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;

    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch(`http://localhost:8080/api/pedidos/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el pedido: ${response.status}`);
        }

        console.log(`Pedido con ID ${id} eliminado exitosamente`);
        renderPedidos();

    } catch (error) {
        console.error("Error al eliminar el pedido:", error);
    }
}

// Ejecutar la función para renderizar los pedidos al cargar la página
renderPedidos();
