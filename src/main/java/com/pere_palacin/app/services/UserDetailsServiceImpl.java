package com.pere_palacin.app.services;

import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.exceptions.UserIdNotFoundException;
import com.pere_palacin.app.models.UserPrincipal;
import com.pere_palacin.app.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

//We need to implement our userDetailsService class in order to implement our own workflow to handle user authentication.
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDao user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new UserPrincipal(user);
    }

    public UserDetails loadUserById(UUID userId) throws UserIdNotFoundException {
        UserDao user = userRepository.findById(userId).orElseThrow(
                () -> new UserIdNotFoundException(userId)
        );
        return new UserPrincipal(user);
    }

    public UUID getRequestingUserId () {
        return (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
