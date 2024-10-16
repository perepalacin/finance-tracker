package com.pere_palacin.app.controllers;

import com.pere_palacin.app.models.Users;
import com.pere_palacin.app.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up")
    public Users register (Users user) {
        return authService.register(user);
    }

    @PostMapping("/sign-in")
    public String login (Users user) {
        return authService.verify(user);
    }

}
