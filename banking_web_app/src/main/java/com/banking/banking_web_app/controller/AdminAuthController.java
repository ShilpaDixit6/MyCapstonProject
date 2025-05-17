package com.banking.banking_web_app.controller;

import com.banking.banking_web_app.model.Admin;
import com.banking.banking_web_app.repository.AdminRepository;

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
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "http://localhost:5174") // Allow frontend origin
public class AdminAuthController {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Admin admin) {
        try {
            // Check if email, phone, or username already exists
            if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Email is already in use!");
            }
            if (adminRepository.findByPhone(admin.getPhone()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Phone number is already in use!");
            }
            if (adminRepository.findByUsername(admin.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Username is already in use!");
            }
    
            // Encode the password and save admin
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
            adminRepository.save(admin);
            return ResponseEntity.ok("Admin registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Unable to register admin");
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

            Optional<Admin> adminOptional = adminRepository.findByEmail(email);
            if (adminOptional.isPresent()) {
                Admin admin = adminOptional.get();
                if (passwordEncoder.matches(password, admin.getPassword())) {
                    // Store admin information in the session
                    session.setAttribute("admin", admin);
                    return ResponseEntity.ok(Map.of(
                            "message", "Login successful",
                            "adminId", admin.getId(),
                            "role", admin.getRole(),
                            "fullName", admin.getFullName(),
                            "email", admin.getEmail()));
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid password");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Admin not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Unable to process login");
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(HttpSession session) {
        Admin admin = (Admin) session.getAttribute("admin"); // Fetch admin from session
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Please log in to access this page."); // Redirect logic handled by frontend
        }
        return ResponseEntity.ok(Map.of(
            "message", "Welcome to your admin dashboard, " + admin.getFullName(),
            "adminId", admin.getId(),
            "email", admin.getEmail(),
            "username", admin.getUsername(), // Added the username to the response
            "role", admin.getRole()
        ));
    }
        
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); // End the session
        return ResponseEntity.ok("Logout successful");
    }
}

