package co.in.vollen.purrsonal.service;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Service;

import co.in.vollen.purrsonal.dto.PetAddRequest;
import co.in.vollen.purrsonal.entity.Pet;
import co.in.vollen.purrsonal.entity.User;
import co.in.vollen.purrsonal.repository.PetRepository;
import co.in.vollen.purrsonal.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetService {

    private final PetRepository petRepository;

    public Pet addPet(PetAddRequest petAddRequest) {

        User user = AuthUtil.getCurrentUser();

        if (user == null) {
            log.error("User not authenticated");
            throw new AuthenticationCredentialsNotFoundException("User not authenticated");
        }

        log.info("Adding pet: {} for user {}", petAddRequest.getName(), user.getUsername());
        
        Pet pet = new Pet();
        pet.setName(petAddRequest.getName());
        pet.setSex(petAddRequest.getSex());
        pet.setBirthDate(petAddRequest.getBirthDate());
        pet.setOwner(user);

        return petRepository.save(pet);
    }

}
