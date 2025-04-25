package com.ecomsense.backend.controller;

import com.ecomsense.backend.dto.LoginRequest;
import com.ecomsense.backend.dto.UserRequest;
import com.ecomsense.backend.dto.UserResponse;
import com.ecomsense.backend.entity.User;
import com.ecomsense.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
//@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

//    @PostMapping("/register")
//    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
//        return ResponseEntity.ok(userService.createUser(user));
//    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody @Valid UserRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }
}
