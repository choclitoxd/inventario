package com.panini.inventario.config;

import com.panini.inventario.usuario.model.Usuario;
import com.panini.inventario.usuario.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SecurityHeaderFilter extends OncePerRequestFilter {

    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String username = request.getHeader("X-User-Username");
        if (username != null && !username.isBlank()) {
            usuarioRepository.findByUsername(username.trim().toLowerCase()).ifPresent(user -> {
                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRol()));
                var auth = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            });
        }
        filterChain.doFilter(request, response);
    }
}
