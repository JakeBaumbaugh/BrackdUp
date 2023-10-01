package tournament.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

import tournament.model.Profile;
import tournament.repository.ProfileRepository;

@Service
public class ProfileService {

    ProfileRepository profileRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }
    
    public Profile getProfileFromPayload(Payload payload) {
        Optional<Profile> profile = profileRepository.findByEmail(payload.getEmail());
        if(profile.isPresent()) {
            return profile.get();
        }
        return profileRepository.save(Profile.fromPayload(payload));
    } 
}
