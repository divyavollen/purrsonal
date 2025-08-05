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
import jakarta.validation.constraints.Pattern;
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
    @Size(min = 3, max = 30)
    private String species;

    @Column
    @Pattern(regexp = "^$|.{3,30}", message = "Must be between 3 and 30 characters")
    private String breed;

    @Column
    @Pattern(regexp = "^$|.{2,20}", message = "Must be between 2 and 20 characters")
    private String furColour;

    @NotNull
    @Column    
    private LocalDate birthDate;

    @ManyToOne
    @JoinColumn(name="userid", nullable=false)
    @JsonBackReference
    private User owner;
}
