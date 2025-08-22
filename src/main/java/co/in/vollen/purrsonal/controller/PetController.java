package co.in.vollen.purrsonal.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import co.in.vollen.purrsonal.dto.PetAddRequest;
import co.in.vollen.purrsonal.dto.PetDeleteRequest;
import co.in.vollen.purrsonal.entity.Pet;
import co.in.vollen.purrsonal.exception.PetAddException;
import co.in.vollen.purrsonal.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pet")
@Slf4j
public class PetController {

    private final PetService petService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllPets() {
        List<Pet> pets = petService.getAllPetsForUser();
        log.info("Pets {} ", pets);
        return ResponseEntity.ok(pets);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPet(@Valid @ModelAttribute PetAddRequest petAddRequest) {

        Pet savedPet = petService.addPet(petAddRequest);
        Long id = savedPet.getId();

        if (id == null) {
            throw new PetAddException("Failed to add pet");
        }

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();

        if (petAddRequest.getPhoto() != null && !petAddRequest.getPhoto().isEmpty()) {

            boolean photoUploaded = petService.uploadPhoto(petAddRequest.getPhoto(), savedPet.getOwner().getUsername(),
                    id, savedPet.getName());

            if (!photoUploaded) {

                return ResponseEntity.created(location).body(Map.of(
                        "message", "Pet added successfully but photo upload failed",
                        "petId", id));
            }
        }
        return ResponseEntity.created(location).body(Map.of(
                "message", "Pet added successfully",
                "petId", id));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deletePet(@RequestBody PetDeleteRequest deleteRequest) {

        petService.deletePet(deleteRequest.getId(), deleteRequest.getName());
        return ResponseEntity.noContent().build();
    }
}
