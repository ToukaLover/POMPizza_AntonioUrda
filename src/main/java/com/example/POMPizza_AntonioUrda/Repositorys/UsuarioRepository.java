package com.example.POMPizza_AntonioUrda.Repositorys;


import com.example.POMPizza_AntonioUrda.Models.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByName(String username);
}