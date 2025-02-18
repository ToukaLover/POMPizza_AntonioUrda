package com.example.POMPizza_AntonioUrda.Repositorys;

import com.example.POMPizza_AntonioUrda.Models.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
}


