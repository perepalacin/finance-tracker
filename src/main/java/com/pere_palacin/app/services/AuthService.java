package com.pere_palacin.app.services;

import java.util.Collection;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.SomethingWentWrongException;
import com.pere_palacin.app.exceptions.UnauthorizedRequestException;
import com.pere_palacin.app.exceptions.UsernameAlreadyExistsException;
import com.pere_palacin.app.models.UserPrincipal;
import com.pere_palacin.app.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public UserDao register (UserDao user) {
        try {
            user.setPassword(encoder.encode(user.getPassword()));
            return userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new UsernameAlreadyExistsException();
        } catch (Exception ex) {
            throw new SomethingWentWrongException();
        }
    }

    public String verify(UserDao user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            UserPrincipal authenticatedUser = (UserPrincipal) authentication.getPrincipal();
            return jwtService.generateToken(authenticatedUser.getUserId());
        }
        return "Failed";
    }

    public void authorizeRequest(UUID itemUserId, UUID userId) {
        if (userId == null) {
            userId = userDetailsService.getRequestingUserId();
        }
        if (!itemUserId.equals(userId)) {
            throw new UnauthorizedRequestException();
        }
    }

    public void authorizeRequest(Collection<UUID> itemsUserIds, UUID userId) {
        if (userId == null) {
            userId = userDetailsService.getRequestingUserId();
        }
        for (UUID itemUserId : itemsUserIds) {
            if (!itemUserId.equals(userId)) {
                throw new UnauthorizedRequestException();
            }
        }

    }
}
