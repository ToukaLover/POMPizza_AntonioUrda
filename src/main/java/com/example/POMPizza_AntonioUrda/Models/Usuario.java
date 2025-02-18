package com.example.POMPizza_AntonioUrda.Models;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Document(collection = "Usuarios") // Nombre de la colección en MongoDB
public class Usuario {

    private String id;

    private String username;

    private String password;

    //@Enumerated(EnumType.STRING)
    private String rol;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

}
