package com.banking.banking_web_app.model;

import jakarta.persistence.*;
import java.util.Random;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;    
    private String bankName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    private double balance;
    private String password;
    private String role;
    private String address;
    @Column(length = 500) // Allow longer messages
    private String message; // Store user's contact message

   
    

    // Default Constructor
    public User() {
        this.bankName = "Dixit Bank";
        this.accountNumber = generateAccountNumber();
        this.balance = 5000.00;
        this.role = "CUSTOMER";
    }

    // Parameterized Constructor
    public User(String fullName, String email, String phone, String username, String password, String address, String message) {
        this();
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.username = username;
        this.password = password;
        this.address = address;
        this.message = message;
        
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAccountNumber() { return accountNumber; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    // Generate a 16-digit unique account number
    private String generateAccountNumber() {
        Random random = new Random();
        return String.format("%016d", random.nextLong() & Long.MAX_VALUE);
    }

    

    
}
