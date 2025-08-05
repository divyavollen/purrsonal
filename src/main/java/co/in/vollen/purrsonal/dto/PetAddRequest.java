package co.in.vollen.purrsonal.dto;

import java.time.LocalDate;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PetAddRequest {

    @NotNull(message = "Name is required")
    @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters")
    @Pattern(regexp = "^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$", message = "Name must start with uppercase and contain only letters and spaces")
    private String name;

    @NotNull(message = "Species is required")
    @Size(min = 3, max = 30, message = "Species must be between 3 and 30 characters")
    @Pattern(regexp = "^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$", message = "Species must start with uppercase and contain only letters and spaces")
    private String species;

    @Pattern.List({
        @Pattern(regexp = "^$|.{3,30}", message = "Must be between 3 and 30 characters"),
        @Pattern(regexp = "^$|^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$", message = "Breed must start with uppercase and contain only letters and spaces")
    })
    private String breed;

    @Pattern.List({
        @Pattern(regexp = "^$|.{3,20}", message = "Must be between 3 and 20 characters"),
        @Pattern(regexp = "^$|^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$", message = "Fur colour must start with uppercase and contain only letters and spaces")
    })
    private String furColour;

    @NotNull(message = "Birthdate colour is required")
    @Past(message = "Birthdate must be in the past")
    private LocalDate birthDate;
}
