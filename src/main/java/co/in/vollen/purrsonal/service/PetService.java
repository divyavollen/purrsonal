package co.in.vollen.purrsonal.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import co.in.vollen.purrsonal.dto.PetAddRequest;
import co.in.vollen.purrsonal.dto.PetUpdateRequest;
import co.in.vollen.purrsonal.entity.Pet;
import co.in.vollen.purrsonal.entity.User;
import co.in.vollen.purrsonal.exception.FileValidationException;
import co.in.vollen.purrsonal.exception.PetNotFoundException;
import co.in.vollen.purrsonal.exception.PhotoUploadException;
import co.in.vollen.purrsonal.repository.PetRepository;
import co.in.vollen.purrsonal.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetService {

    private final PetRepository petRepository;
    private final MinioService minioService;

    private final int MAX_FILE_SIZE_MB = 10 * 1024 * 1024;
    private final int MIN_FILE_SIZE_KB = 50 * 1024;

    public Pet addPet(PetAddRequest petAddRequest) {

        User user = AuthUtil.getCurrentUser();

        MultipartFile file = petAddRequest.getPhoto();
        boolean photoAdded = file != null && !file.isEmpty();

        if (photoAdded) {
            String contentType = file.getContentType();

            if (file.getSize() < MIN_FILE_SIZE_KB) {
                throw new FileValidationException("File is too small. Min size is 50KB.");
            }

            if (file.getSize() > MAX_FILE_SIZE_MB) {
                throw new FileValidationException("File is too large. Max size is 10MB.");
            }

            if (!Arrays.asList("image/jpeg", "image/png").contains(contentType)) {
                throw new FileValidationException("File must be a PNG or JPEG image.");
            }
        }

        log.info("Adding pet: {} for user {}", petAddRequest.getName(), user.getUsername());

        Pet pet = new Pet();
        pet.setName(petAddRequest.getName());
        pet.setSex(petAddRequest.getSex());
        pet.setBirthDate(petAddRequest.getBirthDate());
        pet.setOwner(user);

        return petRepository.save(pet);
    }

    public boolean uploadPhoto(MultipartFile file, String username, Long petId, String petName) {
        try {
            log.info("Uploading photo : {} {} {}", username, petId, petName);
            String imageUrl = minioService.uploadFile(file, username, petId.toString(), petName);
            updatePetImageUrl(petId, imageUrl);
            return true;
        } catch (PhotoUploadException e) {
            return false;
        }
    }

    private void updatePetImageUrl(Long petId, String imageUrl) {

        Optional<Pet> petOpt = petRepository.findById(petId);

        if (petOpt.isPresent()) {
            Pet pet = petOpt.get();
            pet.setImageURL(imageUrl);
            petRepository.save(pet);
        } else {
            log.warn("Pet with id {} not found when updating image URL", petId);
        }
    }

    public List<Pet> getAllPetsForUser() {

        Long id = AuthUtil.getCurrentUserId();
        return petRepository.getAllByOwnerId(id);
    }

    public void deletePet(Long id, String name) {

        User currentUser = AuthUtil.getCurrentUser();

        Pet pet = petRepository.findByIdAndNameAndOwnerId(id, name, currentUser.getId())
                .orElseThrow(
                        () -> new PetNotFoundException(String.format("Pet with name %s not found for user %s", name,
                                currentUser.getUsername())));

        if (pet.getImageURL() != null)
            minioService.deleteFile(currentUser.getUsername(), id.toString(), name, pet.getImageURL());

        log.info("Deleting pet {}", pet);

        petRepository.delete(pet);
    }

    public Pet updatePet(PetUpdateRequest petUpdateReq) {

        User currentUser = AuthUtil.getCurrentUser();

        Pet pet = petRepository
                .findByIdAndOwnerId(petUpdateReq.getId(), currentUser.getId())
                .orElseThrow(
                        () -> new PetNotFoundException(
                                String.format("Pet with id %s not found for user %s", petUpdateReq.getName(),
                                        currentUser.getUsername())));
        log.info("Pet found {}", pet);

        if (petUpdateReq.isPhotoUpdated()) {

            MultipartFile file = petUpdateReq.getPhoto();
            String contentType = file.getContentType();

            if (file.getSize() < MIN_FILE_SIZE_KB) {
                throw new FileValidationException("File is too small. Min size is 50KB.");
            }

            if (file.getSize() > MAX_FILE_SIZE_MB) {
                throw new FileValidationException("File is too large. Max size is 10MB.");
            }

            if (!Arrays.asList("image/jpeg", "image/png").contains(contentType)) {
                throw new FileValidationException("File must be a PNG or JPEG image.");
            }
        }

        if (!pet.getName().equalsIgnoreCase(petUpdateReq.getName()) && pet.getImageURL() != null
                && !pet.getImageURL().isEmpty()) {

            log.info("Deleting old photo");

            if (!petUpdateReq.isPhotoUpdated()) {

                String imageUrl = minioService.renameFile(currentUser.getUsername(), petUpdateReq.getId().toString(),
                        pet.getName(),
                        petUpdateReq.getName(), pet.getImageURL());
                pet.setImageURL(imageUrl);
            }

            minioService.deleteFile(currentUser.getUsername(), petUpdateReq.getId().toString(), pet.getName(),
                    pet.getImageURL());
        }

        log.info("Updating pet: {} for user {}", petUpdateReq.getName(), currentUser.getUsername());

        pet.setName(petUpdateReq.getName());
        pet.setSex(petUpdateReq.getSex());
        pet.setBirthDate(petUpdateReq.getBirthDate());
        pet.setOwner(currentUser);

        return petRepository.save(pet);
    }

}
