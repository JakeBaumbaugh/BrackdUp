package tournament.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

import tournament.model.Profile;
import tournament.model.ProfileRole;
import tournament.repository.ProfileRepository;

@Service
public class ProfileService {

    @Value("${user.admins}")
    List<String> admins;

    ProfileRepository profileRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }
    
    public Profile getProfileFromPayload(Payload payload) {
        return profileRepository.findByEmail(payload.getEmail())
                .orElseGet(() -> {
                    Profile profile = Profile.fromPayload(payload);
                    if(admins.contains(payload.getEmail())) {
                        profile.setRole(ProfileRole.ADMIN);
                    }
                    return profileRepository.save(profile);
                });
    }
}
