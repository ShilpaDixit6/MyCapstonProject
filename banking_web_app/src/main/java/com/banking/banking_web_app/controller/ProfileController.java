package com.banking.banking_web_app.controller;

import com.banking.banking_web_app.model.User;
import com.banking.banking_web_app.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    // Update user profile
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User updatedUser, HttpSession session) {
        // Check if user is logged in
        User loggedInUser = (User) session.getAttribute("user");
        if (loggedInUser == null) {
            return ResponseEntity.status(401).body("Error: Please log in to update profile.");
        }

        // Fetch user from the database
        Optional<User> optionalUser = userRepository.findById(loggedInUser.getId());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Update allowed fields
            user.setFullName(updatedUser.getFullName());
            user.setEmail(updatedUser.getEmail());
            user.setPhone(updatedUser.getPhone());
            user.setUsername(updatedUser.getUsername());
            user.setAddress(updatedUser.getAddress());

            // Save the updated user details
            userRepository.save(user);
            return ResponseEntity.ok("User details updated successfully.");
        } else {
            return ResponseEntity.status(400).body("Error: User not found.");
        }
    }

    // Get user profile
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(HttpSession session) {
        // Check if user is logged in
        User loggedInUser = (User) session.getAttribute("user");
        if (loggedInUser == null) {
            return ResponseEntity.status(401).body("Error: Please log in to view profile.");
        }

        // Fetch user from the database
        Optional<User> optionalUser = userRepository.findById(loggedInUser.getId());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Return only necessary profile details using a DTO
            return ResponseEntity.ok(new UserProfileResponse(
                    user.getFullName(),
                    user.getAddress(),
                    user.getPhone(),
                    user.getEmail(),
                    user.getAccountNumber(),
                    user.getBalance(),
                    user.getUsername(),
                    user.getRole(),
                    user.getBankName()
            ));
        } else {
            return ResponseEntity.status(400).body("Error: User not found.");
        }
    }

    // DTO for returning user profile details
    private static class UserProfileResponse {
        public String fullName;
        public String username;
        public String address;
        public String phone;
        public String email;
        public String accountNumber;
        public double balance;
        public String role;
        public String bankName;

        public UserProfileResponse(String fullName, String address, String phone, String email, String accountNumber, double balance, String username, String role, String bankName) {
            this.fullName = fullName;
            this.address = address;
            this.phone = phone;
            this.email = email;
            this.accountNumber = accountNumber;
            this.balance = balance;
            this.username = username;
            this.role = role;
            this.bankName = bankName;
        }
    }
}
