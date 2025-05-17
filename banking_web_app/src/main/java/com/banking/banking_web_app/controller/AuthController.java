package com.banking.banking_web_app.controller;

import com.banking.banking_web_app.model.User;
import com.banking.banking_web_app.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5174")  // Allow frontend origin
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            // Check if email or phone or username already exists
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Email is already in use!");
            }
            if (userRepository.findByPhone(user.getPhone()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Phone number is already in use!");
            }
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Username is already in use!");
            }

            // Encode the password and save user
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Unable to register user");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpSession session) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Email and Password are required!");
            }

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (passwordEncoder.matches(password, user.getPassword())) {
                    // Store user information in the session
                    session.setAttribute("user", user);
                    return ResponseEntity.ok(Map.of(
                            "message", "Login successful",
                            "userId", user.getId(),
                            "role", user.getRole(),
                            "fullName", user.getFullName(),
                            "email", user.getEmail()));
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid password");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Unable to process login");
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(HttpSession session) {
        User user = (User) session.getAttribute("user"); // Fetch user from session
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Please log in to access this page."); // Redirect logic handled by frontend
        }
        return ResponseEntity.ok(Map.of(
            "message", "Welcome to your dashboard, " + user.getFullName(),
            "userId", user.getId(),
            "email", user.getEmail(),
            "role", user.getRole()
        ));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); // End the session
        return ResponseEntity.ok("Logout successful"); // Frontend handles redirection
    }
}