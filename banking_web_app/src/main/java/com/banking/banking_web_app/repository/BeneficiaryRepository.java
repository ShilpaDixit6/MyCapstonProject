
package com.banking.banking_web_app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.banking.banking_web_app.model.Beneficiary;
import com.banking.banking_web_app.model.User;
@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByUser(User user);
    Optional<Beneficiary> findByUserAndAccountNumber(User user, String accountNumber);
    Optional<User> findByAccountNumber(String accountNumber);
    boolean existsByUserAndAccountNumber(User user, String accountNumber);
}
