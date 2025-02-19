package com.example.POMPizza_AntonioUrda.Controllers;

import com.example.POMPizza_AntonioUrda.Models.Pizza;
import com.example.POMPizza_AntonioUrda.PomPizzaAntonioUrdaApplication;
import com.example.POMPizza_AntonioUrda.Repositorys.PizzaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class PizzaRestController {

    private final PizzaRepository pizzaRepository;

    public PizzaRestController(PizzaRepository pizzaRepository) {
        this.pizzaRepository = pizzaRepository;
    }

    @GetMapping("/api/pizzas")
    public List<Pizza> obtenerPizzas() {
        return pizzaRepository.findAll();
    }

    @GetMapping("/api/pizzas/{id}")
    public ResponseEntity<Pizza> obtenerPizzaPorId(@PathVariable String id) {
        Optional<Pizza> pizza = pizzaRepository.findById(id);

        return pizza.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para agregar una nueva pizza (POST)
    @PostMapping("/api/pizzas/agregar")
    public Pizza agregarPizza(@RequestBody Pizza nuevaPizza) {
        return pizzaRepository.save(nuevaPizza);
    }

    @DeleteMapping("/api/pizzas/delete/{id}")
    public ResponseEntity<String> eliminarPizza(@PathVariable String id){
        Optional<Pizza> pizza = pizzaRepository.findById(id);

        if (pizza.isPresent()) {
            pizzaRepository.deleteById(id);
            return ResponseEntity.ok("Pizza eliminada con éxito");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/api/pizzas/editar/{id}")
    public ResponseEntity<?> editarPizza(@PathVariable String id, @RequestBody Pizza pizzaEditada) {
        Optional<Pizza> pizzaExistente = pizzaRepository.findById(id);
        if (pizzaExistente.isPresent()) {
            Pizza pizza = pizzaExistente.get();
            pizza.setNombre(pizzaEditada.getNombre());
            pizza.setDescripcion(pizzaEditada.getDescripcion());
            pizza.setIngredientes(pizzaEditada.getIngredientes());
            pizza.setPrecio(pizzaEditada.getPrecio());
            pizza.setImagenUrl(pizzaEditada.getImagenUrl());
            pizza.setDisponible(pizzaEditada.getDisponible());

            pizzaRepository.save(pizza);

            return ResponseEntity.ok().body("{\"message\": \"Pizza actualizada exitosamente\"}");
        } else {
            return ResponseEntity.status(404).body("{\"error\": \"Pizza no encontrada\"}");
        }
    }


}
