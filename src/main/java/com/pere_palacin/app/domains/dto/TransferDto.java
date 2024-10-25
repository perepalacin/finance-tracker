package com.pere_palacin.app.domains.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransferDto {
    private UUID id;
    @NotBlank(message = "Transfer name name is required")
    @Size(min = 2, max = 30, message = "The investment name must have between 3 and 30 characters.")
    private String name;

    @NotNull(message = "It is required to assign a transfer to a receiving bank account")
    private UUID receivingBankAccountId;
    private BankAccountDto receivingBankAccountDto;

    @NotNull(message = "It is required to assign a transfer to a sending bank account")
    private UUID sendingBankAccountId;
    private BankAccountDto sendingBankAccountDto;

    private Instant updated_at;
}
