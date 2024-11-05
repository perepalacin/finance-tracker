package com.pere_palacin.app.domains.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 30, message = "The username must have between 4 and 30 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 30, message = "The password must have between 8 and 30 characters")
    @Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter")
    @Pattern(regexp = ".*[!@#$%^&*(),.?\":{}|<>].*", message = "Password must contain at least one special character")
    private String password;
}
