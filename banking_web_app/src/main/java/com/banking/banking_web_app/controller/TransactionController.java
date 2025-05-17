package com.banking.banking_web_app.controller;

import com.banking.banking_web_app.model.Transaction;
import com.banking.banking_web_app.model.User;
import com.banking.banking_web_app.repository.TransactionRepository;
import com.banking.banking_web_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5174")
public class TransactionController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(@RequestBody TransferRequest request, HttpSession session) {
        // Validate logged-in user
        User loggedInUser = (User) session.getAttribute("user"); // Retrieve user from session
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Please log in to perform transactions.");
        }

        // Validate sender's account belongs to the logged-in user
        if (!loggedInUser.getAccountNumber().equals(request.getSenderAccount())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Error: You can only transfer money from your own account.");
        }

        String senderAccount = request.getSenderAccount();
        String receiverAccount = request.getReceiverAccount();
        double amount = request.getAmount();

        // Validate beneficiary account
        Optional<User> receiverOpt = userRepository.findByAccountNumber(receiverAccount);
        if (receiverOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Receiver account not found.");
        }

        User receiver = receiverOpt.get();

        // Check sufficient balance
        if (loggedInUser.getBalance() < amount) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Insufficient balance.");
        }

        // Perform transfer
        loggedInUser.setBalance(loggedInUser.getBalance() - amount); // Debit sender
        receiver.setBalance(receiver.getBalance() + amount); // Credit receiver

        userRepository.save(loggedInUser);
        userRepository.save(receiver);

        // Log transactions
        Transaction debitTransaction = new Transaction(senderAccount, receiverAccount, amount, "DEBIT");
        Transaction creditTransaction = new Transaction(receiverAccount, senderAccount, amount, "CREDIT");

        transactionRepository.save(debitTransaction);
        transactionRepository.save(creditTransaction);

        return ResponseEntity.ok(Map.of(
            "message", "Transfer successful.",
            "debitTransactionId", debitTransaction.getId(),
            "creditTransactionId", creditTransaction.getId()
        ));
    }

    // DTO to accept transfer data
    public static class TransferRequest {
        private String senderAccount;
        private String receiverAccount;
        private double amount;

        // Getters and Setters
        public String getSenderAccount() { return senderAccount; }
        public void setSenderAccount(String senderAccount) { this.senderAccount = senderAccount; }

        public String getReceiverAccount() { return receiverAccount; }
        public void setReceiverAccount(String receiverAccount) { this.receiverAccount = receiverAccount; }

        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
    }


    @GetMapping("/view")
    public ResponseEntity<?> viewTransactions(HttpSession session) {
        // Validate logged-in user
        User loggedInUser = (User) session.getAttribute("user");
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Please log in to view transactions.");
        }

        // Retrieve transactions for the logged-in user's account
        String accountNumber = loggedInUser.getAccountNumber();
        List<Transaction> transactions = transactionRepository.findBySenderAccountOrReceiverAccount(accountNumber, accountNumber);

        return ResponseEntity.ok(transactions);
    }
   }
