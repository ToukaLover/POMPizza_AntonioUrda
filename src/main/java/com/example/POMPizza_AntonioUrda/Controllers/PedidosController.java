package com.example.POMPizza_AntonioUrda.Controllers;

import com.example.POMPizza_AntonioUrda.Models.Pedido;
import com.example.POMPizza_AntonioUrda.Models.Pizza;
import com.example.POMPizza_AntonioUrda.Repositorys.PedidoRepository;
import com.example.POMPizza_AntonioUrda.Repositorys.PizzaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Controller
public class PedidosController {

    private PedidoRepository pedidoRepository;

    public PedidosController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @GetMapping("/pedidos")
    public String verPizzas(Model model){
        return "pedido";
    }

}