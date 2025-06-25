package co.in.vollen.purrsonal.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import co.in.vollen.purrsonal.dto.RegisterRequest;
import co.in.vollen.purrsonal.entity.User;
import co.in.vollen.purrsonal.repository.UserRepository;
import co.in.vollen.purrsonal.security.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    public void registerUser(RegisterRequest request) {
        
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            log.error("Username already taken");
            throw new RuntimeException("Username already taken");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.error("Email already in use");
            throw new RuntimeException("Email already in use");
        }

        User user = new User(request.getUsername(), request.getEmail(), passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        log.info("User {} registered!", request.getUsername());
    }


    public String authenticate(String username, String password) {

        User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            log.error("Invalid credentials");
            throw new BadCredentialsException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(username);
        return token;
    }
}
