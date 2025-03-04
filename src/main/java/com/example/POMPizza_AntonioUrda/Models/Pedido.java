package com.example.POMPizza_AntonioUrda.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "Pedidos") // Nombre de la colección en MongoDB
public class Pedido {

    @Id
    private String id;
    private String cliente;
    private List<PizzaPedido> pizzas;
    private Double total;
    private Date fecha;
    private String estado; // Pendiente, En preparación, Listo, Entregado

    // Constructor vacío (necesario para Spring Data)
    public Pedido() {
    }

    // Constructor con parámetros
    public Pedido(String cliente, List<PizzaPedido> pizzas, Double total, Date fecha, String estado) {
        this.cliente = cliente;
        this.pizzas = pizzas;
        this.total = total;
        this.fecha = fecha;
        this.estado = estado;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public List<PizzaPedido> getPizzas() {
        return pizzas;
    }

    public void setPizzas(List<PizzaPedido> pizzas) {
        this.pizzas = pizzas;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}

// Clase auxiliar para representar una pizza dentro de un pedido
class PizzaPedido {
    private String nombre;
    private Double precio;

    public PizzaPedido() {
    }

    public PizzaPedido(String nombre, Double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }
}
