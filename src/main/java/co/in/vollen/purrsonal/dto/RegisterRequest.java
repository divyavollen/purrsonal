package co.in.vollen.purrsonal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RegisterRequest {

    @NotNull(message = "Username is required")
    @Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters")
    @Pattern(regexp = "^[a-zA-Z](?:[a-zA-Z0-9]|[_-](?![_-]))*[a-zA-Z0-9]$", message = "Username must start with a letter, end with a letter or digit, and may include underscores or hyphens")
    private String username;

    @NotNull(message = "Email is required")
    @Size(min = 6, max = 254, message = "Email must be between 6 and 254 characters")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Password is required")
    @Size(min = 12, max = 64, message = "Password must be between 12 and 64 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]+$", message = "Password must include uppercase and lowercase letters, a number, and a special character (!@#$%^&*)")
    private String password;
}
