package com.example.POMPizza_AntonioUrda.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/auth/login"; // Redirige a la página de login
    }

    @GetMapping("/index")
    public String getIndex(){
        return "index";
    }
}