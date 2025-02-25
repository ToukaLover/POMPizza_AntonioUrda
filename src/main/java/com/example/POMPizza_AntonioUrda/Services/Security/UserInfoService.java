package com.example.POMPizza_AntonioUrda.Services.Security;



import com.example.POMPizza_AntonioUrda.Models.Usuario;
import com.example.POMPizza_AntonioUrda.Repositorys.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder encoder;

    public String addUser(Usuario usuario){
        System.out.println(usuario.getPassword());
        usuario.setPassword(encoder.encode(usuario.getPassword()));
        System.out.println(usuario.getPassword());
        usuarioRepository.save(usuario);
        return "Usuario registrado correctamente";
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Usuario> userDetail = usuarioRepository.findByName(username); // Assuming 'email' is used as username

        // Converting UserInfo to UserDetails
        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    }
}