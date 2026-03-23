package com.streetmonitor.service;

import com.streetmonitor.config.JwtUtil;
import com.streetmonitor.dto.AuthRequest;
import com.streetmonitor.dto.AuthResponse;
import com.streetmonitor.dto.RegisterRequest;
import com.streetmonitor.entity.User;
import com.streetmonitor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${google.client.id:YOUR_GOOGLE_CLIENT_ID}")
    private String googleClientId;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("purukutapuajayreddy@gmail.com".equals(request.getEmail()) ? User.Role.ADMIN : User.Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if ("purukutapuajayreddy@gmail.com".equals(request.getEmail()) && user.getRole() != User.Role.ADMIN) {
            user.setRole(User.Role.ADMIN);
            user = userRepository.save(user);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }

    public AuthResponse googleLogin(String googleTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleTokenString);
            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = User.builder()
                        .name(name != null ? name : "Google User")
                        .email(email)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Random password
                        .role("purukutapuajayreddy@gmail.com".equals(email) ? User.Role.ADMIN : User.Role.USER)
                        .build();
                return userRepository.save(newUser);
            });

            if ("purukutapuajayreddy@gmail.com".equals(email) && user.getRole() != User.Role.ADMIN) {
                user.setRole(User.Role.ADMIN);
                user = userRepository.save(user);
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

            return AuthResponse.builder()
                    .token(token)
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .userId(user.getId())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed", e);
        }
    }
}
