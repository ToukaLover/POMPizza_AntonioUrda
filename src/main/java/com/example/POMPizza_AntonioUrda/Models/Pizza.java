package com.example.POMPizza_AntonioUrda.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "Pizzas") // Nombre de la colección en MongoDB
public class Pizza {

    @Id
    private String id;
    private String nombre;
    private String descripcion;
    private List<String> ingredientes;
    private Double precio;
    private String imagenUrl;
    private Boolean disponible;

    // Constructor vacío (necesario para Spring Data)
    public Pizza() {
    }

    // Constructor con parámetros
    public Pizza(String nombre, String descripcion, List<String> ingredientes, Double precio, String imagenUrl, Boolean disponible) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.ingredientes = ingredientes;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
        this.disponible = disponible;
    }

    public Pizza(String id, String nombre, String descripcion, List<String> ingredientesLista, double precio, String imagenUrl, boolean disponible) {
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<String> getIngredientes() {
        return ingredientes;
    }

    public void setIngredientes(List<String> ingredientes) {
        this.ingredientes = ingredientes;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}
