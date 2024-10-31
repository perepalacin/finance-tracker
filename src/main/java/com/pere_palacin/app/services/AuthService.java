package com.pere_palacin.app.services;

import com.pere_palacin.app.models.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserDao register (UserDao user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String verify(UserDao user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            UserPrincipal authenticatedUser = (UserPrincipal) authentication.getPrincipal();
            // User currentUser = userRepository.findByUsername(user.getUsername());
            return jwtService.generateToken(authenticatedUser.getUserId());
        }
        return "Failed";
    }
}
