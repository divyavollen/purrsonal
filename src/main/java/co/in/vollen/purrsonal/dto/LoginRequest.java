package co.in.vollen.purrsonal.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginRequest {

    @NotNull
    @Size(min = 4, max = 20)
    @Pattern(regexp = "^[a-zA-Z](?:[a-zA-Z0-9]|[_-](?![_-]))*[a-zA-Z0-9]$")
    private String username;

    @NotNull
    @Size(min = 12, max = 64)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]+$")
    private String password;
}
