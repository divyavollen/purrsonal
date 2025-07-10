package co.in.vollen.purrsonal.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
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

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {

        userService.register(request.getUsername(), request.getEmail(), request.getPassword());
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
