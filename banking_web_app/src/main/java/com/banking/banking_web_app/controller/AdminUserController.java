package com.banking.banking_web_app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banking.banking_web_app.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/customers")
@CrossOrigin(origins = "http://localhost:5174")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/view")
public ResponseEntity<?> viewAllCustomers() {
    try {
        // Retrieve all customers and exclude sensitive data
        List<Map<String, Object>> customers = userRepository.findAll()
            .stream()
            .map(customer -> {
                // Create a new HashMap to avoid type inference issues
                Map<String, Object> customerMap = new HashMap<>();
                customerMap.put("id", customer.getId());
                customerMap.put("fullName", customer.getFullName());
                customerMap.put("email", customer.getEmail());
                customerMap.put("phone", customer.getPhone());
                customerMap.put("address", customer.getAddress());
                return customerMap;
            })
            .toList();

        return ResponseEntity.ok(customers);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: Unable to retrieve customer details");
    }
}

}
