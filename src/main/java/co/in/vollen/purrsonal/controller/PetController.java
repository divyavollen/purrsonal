package co.in.vollen.purrsonal.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.in.vollen.purrsonal.dto.PetAddRequest;
import co.in.vollen.purrsonal.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;
    
    @PostMapping("/add")
    public ResponseEntity<String> addPet(@Valid @ModelAttribute PetAddRequest petAddRequest) {
        petService.addPet(petAddRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // public ResponseEntity<String> getPet(Long id) {
    //     return ResponseEntity.ok("Pet details for id: " + id);
    // }
}
