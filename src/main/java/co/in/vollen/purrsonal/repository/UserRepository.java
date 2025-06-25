package co.in.vollen.purrsonal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.in.vollen.purrsonal.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
