package com.example.POMPizza_AntonioUrda.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/") // Mapea la ruta principal ("/")
    public String login() {
        return "login"; // Devuelve la vista "login.html"
    }

    /*@GetMapping("/auth/index ") // Mapea la ruta principal ("/")
    public String index() {
        return "index"; // Devuelve la vista "login.html"
    }*/

}
