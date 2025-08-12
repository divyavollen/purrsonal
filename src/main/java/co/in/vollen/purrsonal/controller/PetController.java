package co.in.vollen.purrsonal.controller;

import java.net.URI;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import co.in.vollen.purrsonal.dto.PetAddRequest;
import co.in.vollen.purrsonal.entity.Pet;
import co.in.vollen.purrsonal.exception.PetAddException;
import co.in.vollen.purrsonal.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

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

        boolean photoUploaded = petService.uploadPhoto(petAddRequest.getPhoto(), savedPet.getOwner().getUsername(), id, savedPet.getName());

        if (!photoUploaded) {

            return ResponseEntity.created(location).body(Map.of(
                    "message", "Pet added successfully but photo upload failed",
                    "petId", id));
        }

        return ResponseEntity.created(location).body(Map.of(
                "message", "Pet added successfully",
                "petId", id));
    }

    // public ResponseEntity<String> getPet(Long id) {
    // return ResponseEntity.ok("Pet details for id: " + id);
    // }
}
