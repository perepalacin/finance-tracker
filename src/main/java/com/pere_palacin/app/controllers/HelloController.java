package com.pere_palacin.app.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/ping")
public class HelloController {

    @GetMapping("")
    public String greet() {
        return "pong!";
    }

}