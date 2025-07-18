package co.in.vollen.purrsonal.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import co.in.vollen.purrsonal.entity.User;
import co.in.vollen.purrsonal.exception.UserAlreadyExistsException;
import co.in.vollen.purrsonal.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public User register(String username, String email, String password) {

        if (repository.existsByUsername(username) || repository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Username or email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));

        return repository.save(user);
    }

    public String authenticate(String username, String password) {

        try {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

            String token = jwtService.generateToken(username);
            
            if(token == null || token.isEmpty()) {
                throw new BadCredentialsException("Invalid username or password");
            }

            return token;
        } catch(Exception ex){
            throw new BadCredentialsException("Invalid username or password");
        }
    }
}
