package com.banking.banking_web_app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.banking.banking_web_app.model.Transaction;
import com.banking.banking_web_app.repository.TransactionRepository;

@RestController
@RequestMapping("/api/admin/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminTransactionController {
    private final TransactionRepository transactionRepository;

    // Constructor injection for TransactionRepository
    public AdminTransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // Endpoint to fetch all transactions
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll(); // Directly fetching data
    }
}
