package com.pere_palacin.app.domains.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IncomeSourceDto {
    private UUID id;
    @NotBlank(message = "Income source name is required")
    @Size(min = 2, max = 30, message = "The income source name must have between 3 and 30 characters.")
    private String name;
    @NotBlank(message = "color is required")
    @Size(min = 2, max = 30, message = "The income source color must have between 3 and 30 characters.")
    private String color;
}
