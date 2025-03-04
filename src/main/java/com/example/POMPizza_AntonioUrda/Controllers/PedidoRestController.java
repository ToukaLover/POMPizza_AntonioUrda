package com.example.POMPizza_AntonioUrda.Controllers;

import com.example.POMPizza_AntonioUrda.Models.Pedido;
import com.example.POMPizza_AntonioUrda.Repositorys.PedidoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoRestController {

    private final PedidoRepository pedidoRepository;

    public PedidoRestController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    // Obtener todos los pedidos
    @GetMapping
    public List<Pedido> obtenerPedidos() {
        return pedidoRepository.findAll();
    }

    // Obtener un pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable String id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        return pedido.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo pedido
    @PostMapping("/agregar")
    public Pedido agregarPedido(@RequestBody Pedido nuevoPedido) {
        nuevoPedido.setFecha(new Date()); // Asignar fecha actual al pedido
        return pedidoRepository.save(nuevoPedido);
    }

    // Eliminar un pedido
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> eliminarPedido(@PathVariable String id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (pedido.isPresent()) {
            pedidoRepository.deleteById(id);
            return ResponseEntity.ok("Pedido eliminado con éxito");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Editar un pedido (cambiar estado, actualizar datos)
    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editarPedido(@PathVariable String id, @RequestBody Pedido pedidoEditado) {
        Optional<Pedido> pedidoExistente = pedidoRepository.findById(id);
        if (pedidoExistente.isPresent()) {
            Pedido pedido = pedidoExistente.get();
            pedido.setEstado(pedidoEditado.getEstado());
            pedido.setPizzas(pedidoEditado.getPizzas());
            pedido.setTotal(pedidoEditado.getTotal());

            pedidoRepository.save(pedido);
            return ResponseEntity.ok().body("{\"message\": \"Pedido actualizado exitosamente\"}");
        } else {
            return ResponseEntity.status(404).body("{\"error\": \"Pedido no encontrado\"}");
        }
    }
}