package co.in.vollen.purrsonal.service;

import java.util.Arrays;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import co.in.vollen.purrsonal.dto.PetAddRequest;
import co.in.vollen.purrsonal.entity.Pet;
import co.in.vollen.purrsonal.entity.User;
import co.in.vollen.purrsonal.exception.FileValidationException;
import co.in.vollen.purrsonal.repository.PetRepository;
import co.in.vollen.purrsonal.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetService {

    private final PetRepository petRepository;

    //TODO get file sizes from properties file
    private final int MAX_FILE_SIZE_MB = 10 * 1024 * 1024;
    private final int MIN_FILE_SIZE_KB = 50 * 1024;

    public Pet addPet(PetAddRequest petAddRequest) {

        User user = AuthUtil.getCurrentUser();

        if (user == null) {
            log.error("User not authenticated");
            throw new AuthenticationCredentialsNotFoundException("User not authenticated");
        }
        // TODO: Validate logged in user token

        MultipartFile file = petAddRequest.getPhoto();
        String contentType = file.getContentType();

        if (!file.isEmpty() && file.getSize() < MIN_FILE_SIZE_KB) {
            throw new FileValidationException("File is too small. Min size is 50KB.");
        }

        if (!file.isEmpty() && file.getSize() > MAX_FILE_SIZE_MB) {
            throw new FileValidationException("File is too large. Max size is 10MB.");
        }

        if (!Arrays.asList("image/jpeg", "image/png").contains(contentType)) {
            throw new FileValidationException("File must be a PNG or JPEG image.");
        }

        log.info("Adding pet: {} for user {}", petAddRequest.getName(), user.getUsername());
        log.info("Photo size {}", file.isEmpty() ? "0" : file.getSize()/ (1024.0 * 1024.0));

        Pet pet = new Pet();
        pet.setName(petAddRequest.getName());
        pet.setSex(petAddRequest.getSex());
        pet.setBirthDate(petAddRequest.getBirthDate());
        pet.setOwner(user);

        //TODO: minio upload logic here

        return petRepository.save(pet);
    }

}
