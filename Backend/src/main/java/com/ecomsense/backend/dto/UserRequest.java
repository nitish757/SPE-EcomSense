package com.ecomsense.backend.dto;

import jakarta.validation.constraints.*;

public record UserRequest(@NotNull(message = "User should be present")
                           @NotEmpty(message = "User should be present")
                           @NotBlank(message = "User should be present")

                          String firstName,

                          String lastName,

                          @NotNull(message = "User email is required")
                          @Email(message = "Email must be in correct format")
                           String email,

                          @NotNull(message = "Password should be present")
                           @NotEmpty(message = "Password should be present")
                           @NotBlank(message = "Password should be present")
                           @Size(min = 6, max = 12)
                           String password,

                          String role) {
}
