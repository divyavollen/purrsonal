package co.in.vollen.purrsonal.dto;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PetUpdateRequest {

    @NotNull(message = "Pet ID doesn't exist")
    private Long id;

    @NotNull(message = "Name is required")
    @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters")
    @Pattern(regexp = "^[A-Z][a-zA-Z]*(?: [a-zA-Z]+)*$", message = "Name must start with uppercase and contain only letters and spaces")
    private String name;
    
    @Pattern.List({
        @Pattern(regexp = "^$|.{4,6}", message = "Sex must be between 4 and 6 characters"),
        @Pattern(regexp = "^[A-Z][a-zA-Z]*$", message = "Sex must start with uppercase and contain only letters")
    })
    private String sex;

    @NotNull(message = "Birthdate is required")
    @Past(message = "Birthdate must be in the past")
    private LocalDate birthDate;

    private MultipartFile photo;

    private boolean isPhotoUpdated;
}
