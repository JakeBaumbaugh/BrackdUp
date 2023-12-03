package tournament.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

import tournament.model.Profile;
import tournament.model.ProfileRole;
import tournament.model.RevokedJwt;
import tournament.model.TournamentVoter;
import tournament.model.TournamentVoterId;
import tournament.repository.ProfileRepository;
import tournament.repository.RevokedJwtRepository;
import tournament.repository.TournamentVoterRepository;

@Service
public class ProfileService {

    @Value("${user.admins}")
    List<String> admins;

    ProfileRepository profileRepository;
    TournamentVoterRepository tournamentVoterRepository;
    RevokedJwtRepository revokedJwtRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository,
                          TournamentVoterRepository tournamentVoterRepository,
                          RevokedJwtRepository revokedJwtRepository) {
        this.profileRepository = profileRepository;
        this.tournamentVoterRepository = tournamentVoterRepository;
        this.revokedJwtRepository = revokedJwtRepository;
    }
    
    public Profile getProfileFromPayload(Payload payload) {
        Profile profile = profileRepository.findByEmail(payload.getEmail())
                .orElseGet(() -> {
                    // Create profile
                    Profile p = Profile.fromPayload(payload);
                    p.setRole(admins.contains(payload.getEmail()) ? ProfileRole.ADMIN : ProfileRole.USER);
                    return profileRepository.save(p);
                });
        // Add profile to any tournament voters
        List<TournamentVoter> voters = tournamentVoterRepository.findAllByEmail(profile.getEmail());
        voters.forEach(voter -> voter.setProfile(profile));
        tournamentVoterRepository.saveAll(voters);

        return profile;
    }

    public Optional<Profile> findByEmail(String email) {
        return profileRepository.findByEmail(email);
    }

    public boolean profileCanVote(Profile profile, Integer tournamentId) {
        TournamentVoterId voterId = new TournamentVoterId(tournamentId, profile.getEmail());
        return tournamentVoterRepository.findById(voterId).isPresent();
    }

    public boolean profileCanCreate(Profile profile) {
        return profile.isAdmin();
    }

    public boolean profileCanEdit(Profile profile) {
        return profile.isAdmin();
    }

    public boolean isJwtRevoked(String jwt) {
        return revokedJwtRepository.findById(jwt).isPresent();
    }

    public void revokeJwt(String jwt) {
        revokedJwtRepository.save(new RevokedJwt(jwt));
    }
}
