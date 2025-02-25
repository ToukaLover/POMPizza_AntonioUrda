package com.example.POMPizza_AntonioUrda.Controllers;

import com.example.POMPizza_AntonioUrda.Models.AuthRequest;
import com.example.POMPizza_AntonioUrda.Models.Usuario;
import com.example.POMPizza_AntonioUrda.Repositorys.UsuarioRepository;
import com.example.POMPizza_AntonioUrda.Services.Security.JwtService;
import com.example.POMPizza_AntonioUrda.Services.Security.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class UsuarioRestController {

    @Autowired
    private UserInfoService service;

    private UsuarioRepository usuarioRepository;

    public UsuarioRestController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioRestController() {
    }

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this endpoint is not secure";
    }

    @GetMapping("/users")
    public List<Usuario> allUsers(){
        return usuarioRepository.findAll();
    }

    @PostMapping("/addNewUser")
    public String addNewUser(@RequestBody Usuario userInfo) {
        return service.addUser(userInfo);
    }

    @GetMapping("/user/userProfile")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public String userProfile() {
        return "Welcome to User Profile";
    }

    @GetMapping("/admin/adminProfile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }

    @PostMapping("/generateToken")
    public ResponseEntity<String> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            // Obtener UserDetails a partir del username
            UserDetails userDetails = service.loadUserByUsername(authRequest.getUsername());

            // Generar el token usando UserDetails
            String token = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
        }
    }


}