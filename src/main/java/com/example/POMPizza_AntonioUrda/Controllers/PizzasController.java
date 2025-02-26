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
    @GetMapping("/admin/pizzas/nueva")
    public String mostrarFormulario() {
        return "catalogo/nuevaPizza";
    }

    @GetMapping("/admin/pizzas/editar/{id}")
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
}
