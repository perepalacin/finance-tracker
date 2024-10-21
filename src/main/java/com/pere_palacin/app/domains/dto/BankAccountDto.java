package com.pere_palacin.app.domains.dto;

import com.pere_palacin.app.domains.UserDao;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BankAccountDto {
    private UUID id;
    @NotBlank(message = "Account name is required")
    @Size(min = 2, max = 30, message = "The account name must have between 3 and 30 characters.")
    private String name;
    private BigDecimal currentBalance;
    @PositiveOrZero(message = "Initial amount must be positive or zero")
    private BigDecimal initialAmount;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal totalTransferOut;
    private BigDecimal totalTransferIn;
    private BigDecimal totalInvested;
}
