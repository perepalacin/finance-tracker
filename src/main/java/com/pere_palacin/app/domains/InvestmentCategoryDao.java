package com.pere_palacin.app.domains;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "investment_categories")
public class InvestmentCategoryDao {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;
        @Column(nullable = false)
        private String investmentCategoryName;
        private String color;

        @ManyToOne
        @JoinColumn(name = "user_id", referencedColumnName = "id")
        private UserDao user;
}
