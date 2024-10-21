package com.pere_palacin.app.domains;

import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "expenses")
public class ExpenseDao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Column(nullable = false)
    private BigDecimal amount;
    private String annotation;

    @ManyToOne
    @JoinColumn(name = "categories", referencedColumnName = "id")
    private CategoryDao category;

    @ManyToOne //We swap the id for the object it relates to and we provide the type of relationship on top.
    @JoinColumn(name = "bank_accounts", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private BankAccountDao bankAccount;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private Instant created_at;

    @LastModifiedDate
    private Instant updated_at;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserDao user;
}
