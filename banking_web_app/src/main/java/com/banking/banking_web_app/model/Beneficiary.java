package com.banking.banking_web_app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "beneficiaries")
public class Beneficiary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;  
    private String bankName;
    private String accountNumber;
    private double maxTransferLimit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // Ensure proper foreign key relationship
    private User user;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;  // Changed from 'getName' to 'getFullName'
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;  // Changed from 'setName' to 'setFullName'
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public double getMaxTransferLimit() {
        return maxTransferLimit;
    }

    public void setMaxTransferLimit(double maxTransferLimit) {
        this.maxTransferLimit = maxTransferLimit;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
