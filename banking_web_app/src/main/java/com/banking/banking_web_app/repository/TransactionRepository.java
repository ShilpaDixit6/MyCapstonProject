package com.banking.banking_web_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.banking.banking_web_app.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderAccountOrReceiverAccount(String accountNumber, String accountNumber2);
    
}