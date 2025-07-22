package co.in.vollen.purrsonal.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.in.vollen.purrsonal.dto.LoginRequest;
import co.in.vollen.purrsonal.dto.RegisterRequest;
import co.in.vollen.purrsonal.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping(value = "/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {

        userService.register(request.getUsername(), request.getEmail(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest request) {

        String token = userService.authenticate(request.getUsername(), request.getPassword());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return new ResponseEntity<Map<String, String>>(response, HttpStatus.OK);
    }
}
