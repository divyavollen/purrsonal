package co.in.vollen.purrsonal.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.in.vollen.purrsonal.dto.LoginRequest;
import co.in.vollen.purrsonal.dto.RegisterRequest;
import co.in.vollen.purrsonal.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @Operation(summary = "Register a new user", description = "Creates a new user in the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error or user already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            userService.registerUser(request);
            return new ResponseEntity<>(Map.of("message", "User registered successfully"), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", "Registration failed: " + e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Authenticate user and return JWT", description = "Takes a username and password, and returns a JWT token if authentication succeeds.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful - returns JWT token", content = @Content(mediaType = "application/json", schema = @Schema(example = "{\"token\": \"<JWT token>\"}"))),
            @ApiResponse(responseCode = "401", description = "Invalid username or password", content = @Content(mediaType = "text/plain"))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            ResponseCookie response = userService.authenticate(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid username or password"));
        }
    }
}