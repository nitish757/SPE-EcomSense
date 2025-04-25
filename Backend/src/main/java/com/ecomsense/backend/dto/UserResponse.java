package com.ecomsense.backend.dto;

public record UserResponse(
                            String firstName,
                            String lastName,
                            String email,
                            String role) {
}
