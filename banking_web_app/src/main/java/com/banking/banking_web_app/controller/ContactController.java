package com.banking.banking_web_app.controller;

import com.banking.banking_web_app.model.User;
import com.banking.banking_web_app.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final UserRepository userRepository;

    public ContactController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitContactForm(@RequestBody User userRequest, Long id) {
        // Fetch existing user based on email or phone
        User user = userRepository.findById(id)
    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));


        // Update message
        user.setMessage(userRequest.getMessage());
        userRepository.save(user); // Store message in DB

        return ResponseEntity.ok("Thank you! Your message has been received.");
    }
}
