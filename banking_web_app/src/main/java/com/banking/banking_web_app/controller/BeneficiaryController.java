package com.banking.banking_web_app.controller;

import com.banking.banking_web_app.model.Beneficiary;
import com.banking.banking_web_app.model.User;
import com.banking.banking_web_app.repository.BeneficiaryRepository;
import com.banking.banking_web_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/beneficiaries")
@CrossOrigin(origins = "http://localhost:5174")
public class BeneficiaryController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository; // Assuming you have a repository for beneficiaries

    @GetMapping("/fetch/{accountNumber}")
    public ResponseEntity<?> fetchBeneficiaryDetails(@PathVariable String accountNumber) {
        System.out.println("Fetching beneficiary details for account number: " + accountNumber);

        // Repository call
        Optional<User> userOptional = userRepository.findByAccountNumber(accountNumber);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("User found: " + user.getFullName());
            return ResponseEntity.ok(Map.of(
                    "fullName", user.getFullName(),
                    "bankName", user.getBankName(),
                    "accountNumber", user.getAccountNumber()
            ));
        } else {
            System.out.println("User not found for account number: " + accountNumber);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: User with given account number not found.");
        }
    }

    @PostMapping("/add/{email}")
    public ResponseEntity<?> addBeneficiary(@PathVariable String email, @RequestBody Map<String, Object> request) {
        String accountNumber = (String) request.get("accountNumber");
        double maxTransferLimit = Double.parseDouble(request.get("maxTransferLimit").toString());
    
        try {
            Optional<User> loggedInUserOpt = userRepository.findByEmail(email);
            if (loggedInUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Logged-in user not found.");
            }
    
            User loggedInUser = loggedInUserOpt.get();
            
            // Prevent adding the user as their own beneficiary
            if (loggedInUser.getAccountNumber().equals(accountNumber)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Cannot add yourself as a beneficiary.");
            }
    
            // Check if the beneficiary already exists for this user
            if (beneficiaryRepository.existsByUserAndAccountNumber(loggedInUser, accountNumber)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Beneficiary already added.");
            }
    
            // Retrieve the beneficiary user
            Optional<User> beneficiaryOpt = userRepository.findByAccountNumber(accountNumber);
            if (beneficiaryOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Beneficiary account number not found.");
            }
    
            User beneficiaryUser = beneficiaryOpt.get();
    
            // Save the new beneficiary
            Beneficiary newBeneficiary = new Beneficiary();
            newBeneficiary.setFullName(beneficiaryUser.getFullName());
            newBeneficiary.setBankName(beneficiaryUser.getBankName());
            newBeneficiary.setAccountNumber(accountNumber);
            newBeneficiary.setMaxTransferLimit(maxTransferLimit);
            newBeneficiary.setUser(loggedInUser);
    
            beneficiaryRepository.save(newBeneficiary);
    
            return ResponseEntity.ok(Map.of(
                "message", "Beneficiary added successfully.",
                "beneficiaryDetails", Map.of(
                    "fullName", beneficiaryUser.getFullName(),
                    "bankName", beneficiaryUser.getBankName(),
                    "accountNumber", accountNumber,
                    "maxTransferLimit", maxTransferLimit
                )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Unable to add beneficiary.");
        }
    }
    
    @GetMapping("/{email}")
    public ResponseEntity<?> getBeneficiariesForUser(@PathVariable String email) {
        Optional<User> loggedInUserOpt = userRepository.findByEmail(email);
    
        if (loggedInUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: User not found.");
        }
    
        User loggedInUser = loggedInUserOpt.get();
        List<Beneficiary> beneficiaries = beneficiaryRepository.findByUser(loggedInUser);
    
        return ResponseEntity.ok(beneficiaries);
    }
    

     // Delete a beneficiary for a user
     @DeleteMapping("/delete/{beneficiaryId}")
     public ResponseEntity<?> deleteBeneficiary(@PathVariable Long beneficiaryId) {
         Optional<Beneficiary> beneficiaryOpt = beneficiaryRepository.findById(beneficiaryId);
 
         if (beneficiaryOpt.isEmpty()) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Beneficiary not found.");
         }
 
         beneficiaryRepository.deleteById(beneficiaryId);
         return ResponseEntity.ok("Beneficiary deleted successfully.");
     }
    


     // Update max transfer limit for a beneficiary
    @PutMapping("/update/{beneficiaryId}")
    public ResponseEntity<?> updateBeneficiary(@PathVariable Long beneficiaryId, @RequestBody Map<String, Object> request) {
        Optional<Beneficiary> beneficiaryOpt = beneficiaryRepository.findById(beneficiaryId);

        if (beneficiaryOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Beneficiary not found.");
        }

        double newMaxTransferLimit = Double.parseDouble(request.get("maxTransferLimit").toString());
        Beneficiary beneficiary = beneficiaryOpt.get();
        beneficiary.setMaxTransferLimit(newMaxTransferLimit);
        beneficiaryRepository.save(beneficiary);

        return ResponseEntity.ok(Map.of(
            "message", "Beneficiary updated successfully.",
            "beneficiaryDetails", Map.of(
                "fullName", beneficiary.getFullName(),
                "bankName", beneficiary.getBankName(),
                "accountNumber", beneficiary.getAccountNumber(),
                "maxTransferLimit", beneficiary.getMaxTransferLimit()
            )
        ));
    }
}

    
