package co.in.vollen.purrsonal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.in.vollen.purrsonal.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String foo);

    boolean existsByUsername(String username);
}
