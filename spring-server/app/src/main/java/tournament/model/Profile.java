package tournament.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String email;
    private String firstName;
    private String lastName;
    private String pictureLink;
    @Enumerated(EnumType.STRING)
    private ProfileRole role;

    public static Profile fromPayload(Payload googlePayload) {
        Profile profile = new Profile();
        profile.setEmail(googlePayload.getEmail());
        profile.setFirstName((String) googlePayload.get("given_name"));
        profile.setLastName((String) googlePayload.get("family_name"));
        profile.setPictureLink((String) googlePayload.get("picture"));
        return profile;
    }

    @Transient
    @JsonIgnore
    public String getName() {
        if(lastName == null) {
            return firstName;
        }
        if(firstName == null) {
            return lastName;
        }
        return firstName + " " + lastName;
    }

    @Transient
    @JsonIgnore
    public boolean canDeleteTournament(Tournament tournament) {
        // TODO: tournament managers that can delete tournament
        return role == ProfileRole.ADMIN;
    }

    @Transient
    @JsonIgnore
    public boolean canCreateTournament() {
        return role == ProfileRole.ADMIN;
    }
}
