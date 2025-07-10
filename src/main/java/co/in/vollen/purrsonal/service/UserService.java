package co.in.vollen.purrsonal.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import co.in.vollen.purrsonal.entity.User;
import co.in.vollen.purrsonal.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    
    public User register(String username, String email, String password) {

        if(repository.existsByUsername(username)|| repository.existsByEmail(email)) {
            return null;
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));

        return repository.save(user);
    }

    public String authenticate(String username, String password) {

        User user = repository.findByUsername(username).orElse(null);

        if(!passwordEncoder.matches(password, user.getPassword())) {

            return null;            
        }

        //generate and return JWT
        return "";
    }
}
