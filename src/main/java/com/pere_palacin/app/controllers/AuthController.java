package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.domains.dto.UserDto;
import com.pere_palacin.app.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<Void> register(@Valid @RequestBody UserDto userDto) {
        UserDao user = UserDao.builder()
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .build();
        authService.register(user);
        return new ResponseEntity<>(CREATED);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<Void> login(@Valid @RequestBody UserDto userDto, HttpServletResponse response) {
        UserDao user = UserDao.builder()
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .build();
        String bearerToken = authService.verify(user);

        ResponseCookie cookie = ResponseCookie.from("token", bearerToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();

        response.setHeader("Set-Cookie", cookie.toString());

        return new ResponseEntity<>(OK);
    }
}