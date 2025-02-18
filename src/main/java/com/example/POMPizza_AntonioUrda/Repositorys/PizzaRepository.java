package com.example.POMPizza_AntonioUrda.Repositorys;

import com.example.POMPizza_AntonioUrda.Models.Pizza;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PizzaRepository extends MongoRepository<Pizza, String> {
}