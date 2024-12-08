package com.pere_palacin.app.controllers;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.is;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.Mockito.doReturn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.pere_palacin.app.domains.BankAccountDao;
import com.pere_palacin.app.services.BankAccountService;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class BankAccountControllerTests {

    @MockBean
    private BankAccountService mockBankAccountService;

    @Autowired
    private MockMvc mockMvc;


    @Test
    @WithMockUser(username = "perepalacin", roles = {"USER"})
    @DisplayName("GET /accouts/a49232a7-e61e-4bdf-84ae-1ab658b090e8 - Found")
    void testGetAccountByIdFound() throws Exception {
        BankAccountDao mockBankAccountDao = BankAccountDao.builder()
                .id(UUID.fromString("a49232a7-e61e-4bdf-84ae-1ab658b090e8"))
                .name("Test account")
                .initialAmount(new BigDecimal(0))
                .build();

        doReturn(mockBankAccountDao).when(mockBankAccountService)
                .findById(UUID.fromString("a49232a7-e61e-4bdf-84ae-1ab658b090e8"));

        mockMvc.perform(get("/api/v1/accounts/{id}", "a49232a7-e61e-4bdf-84ae-1ab658b090e8"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is("a49232a7-e61e-4bdf-84ae-1ab658b090e8")))
                .andExpect(jsonPath("$.name", is("Test account")))
                .andExpect(jsonPath("$.initialAmount", is(0)));
    }
}
