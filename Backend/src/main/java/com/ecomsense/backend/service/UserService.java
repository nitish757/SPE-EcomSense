package com.ecomsense.backend.service;

import com.ecomsense.backend.dto.LoginRequest;
import com.ecomsense.backend.dto.UserRequest;
import com.ecomsense.backend.dto.UserResponse;
import com.ecomsense.backend.entity.User;
import com.ecomsense.backend.helper.JwtHelper;
import com.ecomsense.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepo userRepo;

    private final JwtHelper jwtService;

    private final AuthenticationManager authManager;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

//    public User createUser(User user) {
//        user.setPassword(encoder.encode(user.getPassword()));
//        return userRepo.save(user);
//    }

    public UserResponse createUser(UserRequest request) {
        if (userRepo.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPassword(encoder.encode(request.password())); // Hashing
        user.setRole(request.role());

        User saved = userRepo.save(user);

        return new UserResponse(
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getRole()
        );
    }

    public String login(LoginRequest request) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        if (authentication.isAuthenticated())
            return jwtService.generateToken(request.email());

        return "Fail";
    }


}
