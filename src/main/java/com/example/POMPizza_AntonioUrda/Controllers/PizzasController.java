package com.example.POMPizza_AntonioUrda.Controllers;

import com.example.POMPizza_AntonioUrda.Models.Pizza;
import com.example.POMPizza_AntonioUrda.Repositorys.PizzaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Controller
public class PizzasController {

    private PizzaRepository pizzaRepository;

    public PizzasController(PizzaRepository pizzaRepository) {
        this.pizzaRepository = pizzaRepository;
    }

    @GetMapping("/pizzas")
    public String verPizzas(Model model){
        model.addAttribute("pizzas",pizzaRepository.findAll());
        return "catalogo/pizzas";
    }

    // Mostrar formulario para agregar una nueva pizza
    @GetMapping("/pizzas/nueva")
    public String mostrarFormulario() {
        return "catalogo/nuevaPizza";
    }

    // Procesar el formulario y guardar la nueva pizza
    @PostMapping("/pizzas/agregar")
    public String agregarPizza(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam String ingredientes,
            @RequestParam double precio,
            @RequestParam String imagenUrl,
            @RequestParam boolean disponible) {

        List<String> ingredientesLista = Arrays.asList(ingredientes.split("\\s*,\\s*")); // Convertir ingredientes a lista
        Pizza nuevaPizza = new Pizza(nombre, descripcion, ingredientesLista, precio, imagenUrl, disponible);
        pizzaRepository.save(nuevaPizza);

        return "redirect:/pizzas"; // Redirigir a la lista de pizzas después de agregar
    }

    @GetMapping("/pizzas/editar/{id}")
    public String editarPizzaId(@PathVariable String id,Model model){
        Optional<Pizza> pizza = pizzaRepository.findById(id);

        if (pizza.isPresent()){

            String ingredientes = String.join(", ", pizza.get().getIngredientes());

            model.addAttribute("ingredientes",ingredientes);
            model.addAttribute("pizza",pizza.get());
            return "catalogo/editarPizza";
        }else {
            return "redirect:/pizzas";
        }
    }

    @PostMapping("/pizzas/editar")
    public String editarPizza(@ModelAttribute("Pizza")Pizza pizza, BindingResult result) {
        if (result.hasErrors()) {
            return "redirect:/pizzas";
        }
        pizzaRepository.save(pizza);
        return "redirect:/pizzas"; // Redirigir a la lista de pizzas después de agregar
    }

    // Eliminar una pizza
    @PostMapping("/pizzas/delete/{id}")
    public String eliminarAgrupacion(@PathVariable String id) {
        pizzaRepository.deleteById(id);
        return "redirect:/pizzas";
    }

}
