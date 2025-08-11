package co.in.vollen.purrsonal.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "pets")
@Data
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column
    @Size(min = 2, max = 30)
    private String name;

    @NotBlank
    @Column
    @Size(min = 4, max = 6)
    private String sex;

    @NotNull
    @Column    
    private LocalDate birthDate;

    @ManyToOne
    @JoinColumn(name="userid", nullable=false)
    @JsonBackReference
    private User owner;
}
