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
public class InvestmentCategoryDto {
    private UUID id;
    @NotBlank(message = "Investment category name is required")
    @Size(min = 2, max = 30, message = "The investment category name must have between 3 and 30 characters.")
    private String investmentCategoryName;
    @NotBlank(message = "Investment category icon is required")
    @Size(min = 2, max = 30, message = "The investment category color must have between 3 and 30 characters.")
    private String color;
}
