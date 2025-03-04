package com.example.POMPizza_AntonioUrda.Repositorys;

import com.example.POMPizza_AntonioUrda.Models.Pedido;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PedidoRepository extends MongoRepository<Pedido, String> {
}
