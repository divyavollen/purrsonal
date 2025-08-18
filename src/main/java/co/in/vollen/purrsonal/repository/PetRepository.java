package co.in.vollen.purrsonal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.in.vollen.purrsonal.entity.Pet;

public interface PetRepository extends JpaRepository<Pet, Long> {
    
    List<Pet> getAllByOwnerId(Long ownerId);
}
