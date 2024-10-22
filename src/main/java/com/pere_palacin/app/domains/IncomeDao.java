package com.pere_palacin.app.domains;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "incomes")
public class IncomeDao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
}
