package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.UserDao;
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
    public UserDao register (UserDao user) {
        return authService.register(user);
    }

    @PostMapping("/sign-in")
    public String login (UserDao user) {
        return authService.verify(user);
    }

}
