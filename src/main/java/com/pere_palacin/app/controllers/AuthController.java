package com.pere_palacin.app.controllers;

import com.pere_palacin.app.domains.UserDao;
import com.pere_palacin.app.domains.dto.UserDto;
import com.pere_palacin.app.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<UserDto> register (@Valid @RequestBody UserDto userDto) {
        UserDao user = UserDao.builder().username(userDto.getUsername()).password(userDto.getPassword()).build();
        authService.register(user);
        return new ResponseEntity<>(null, CREATED);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<String> login (@Valid @RequestBody UserDto userDto) {
        UserDao user = UserDao.builder().username(userDto.getUsername()).password(userDto.getPassword()).build();
        String bearerToken = authService.verify(user);
        return new ResponseEntity<>(bearerToken, OK); //Returns a token
    }

}
