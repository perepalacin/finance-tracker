package com.pere_palacin.app.domains.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CategoryDto {
    private UUID id;
    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 30, message = "The category name must have between 3 and 30 characters.")
    private String categoryName;
    @NotBlank(message = "Category icon is required")
    @Size(min = 2, max = 30, message = "The category icon must have between 3 and 30 characters.")
    private String iconName;
}
