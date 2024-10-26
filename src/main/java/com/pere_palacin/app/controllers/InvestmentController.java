package com.pere_palacin.app.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/investments")
@RequiredArgsConstructor
public class InvestmentController {

}
