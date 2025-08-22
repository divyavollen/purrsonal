package co.in.vollen.purrsonal.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PetDeleteRequest {
    
    private Long id;
    private String name;
}
