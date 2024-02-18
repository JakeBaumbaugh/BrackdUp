package tournament.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

import jakarta.transaction.Transactional;
import tournament.model.Profile;
import tournament.model.ProfileRole;
import tournament.model.RevokedJwt;
import tournament.model.Tournament;
import tournament.model.TournamentPrivacy;
import tournament.model.TournamentVoter;
import tournament.model.TournamentVoterId;
import tournament.repository.ProfileRepository;
import tournament.repository.RevokedJwtRepository;
import tournament.repository.TournamentRepository;
import tournament.repository.TournamentVoterRepository;
import tournament.repository.VoteRepository;

@Service
public class ProfileService {

    @Value("${user.admins}")
    List<String> admins;

    ProfileRepository profileRepository;
    TournamentRepository tournamentRepository;
    TournamentVoterRepository tournamentVoterRepository;
    VoteRepository voteRepository;
    RevokedJwtRepository revokedJwtRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository,
                          TournamentRepository tournamentRepository,
                          TournamentVoterRepository tournamentVoterRepository,
                          VoteRepository voteRepository,
                          RevokedJwtRepository revokedJwtRepository) {
        this.profileRepository = profileRepository;
        this.tournamentRepository = tournamentRepository;
        this.tournamentVoterRepository = tournamentVoterRepository;
        this.voteRepository = voteRepository;
        this.revokedJwtRepository = revokedJwtRepository;
    }

    public List<Profile> getProfiles() {
        return profileRepository.findAll();
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

    public Optional<Profile> updateProfile(Profile profile) {
        return profileRepository.findById(profile.getId()).map(oldProfile -> {
            oldProfile.setFirstName(profile.getFirstName());
            oldProfile.setLastName(profile.getLastName());
            oldProfile.setRole(profile.getRole());
            return profileRepository.save(oldProfile);
        });
    }

    @Transactional
    public void deleteProfile(Integer id) {
        voteRepository.deleteAllByProfileId(id);
        tournamentVoterRepository.deleteAllByProfileId(id);
        profileRepository.deleteById(id);
    }

    public boolean profileCanView(Profile profile, Integer tournamentId) {
        Optional<Tournament> tournament = tournamentRepository.findById(tournamentId);
        if (tournament.isEmpty()) {
            return false;
        }
        // If tournament is not private, profile can view
        boolean isPrivate = tournament
                .map(t -> t.getPrivacy() == TournamentPrivacy.PRIVATE)
                .orElse(false);
        if (!isPrivate) {
            return true;
        }
        // Anonymous users then cannot view
        if (profile == null) {
            return false;
        }
        // If profile can edit, profile can vew (this includes all admins)
        if (profileCanEdit(profile, tournamentId)) {
            return true;
        }
        // Otherwise must check if profile is a voter
        TournamentVoterId voterId = new TournamentVoterId(tournamentId, profile.getEmail());
        return tournamentVoterRepository.findById(voterId).isPresent();
    }

    public boolean profileCanVote(Profile profile, Integer tournamentId) {
        Optional<Tournament> tournament = tournamentRepository.findById(tournamentId);
        if (tournament.isEmpty()) {
            return false;
        }
        // If tournament is public, profile can vote
        boolean isPublic = tournament
                .map(t -> t.getPrivacy() == TournamentPrivacy.PUBLIC)
                .orElse(false);
        if (isPublic) {
            return true;
        }
        // Otherwise, must check if profile is a voter
        if (profile == null) {
            return false;
        }
        TournamentVoterId voterId = new TournamentVoterId(tournamentId, profile.getEmail());
        return tournamentVoterRepository.findById(voterId).isPresent();
    }

    public boolean profileCanCreate(Profile profile) {
        return profile != null && (profile.isAdmin() || profile.getRole() == ProfileRole.CREATOR);
    }

    public boolean profileCanEdit(Profile profile, Integer tournamentId) {
        if (profile == null) {
            return false;
        }
        if (profile.isAdmin()) {
            return true;
        }
        return tournamentRepository.findById(tournamentId)
                .map(Tournament::getCreatorId)
                .map(creatorId -> profile.getId().equals(creatorId))
                .orElse(false);
    }

    public boolean isJwtRevoked(String jwt) {
        return revokedJwtRepository.findById(jwt).isPresent();
    }

    public void revokeJwt(String jwt) {
        revokedJwtRepository.save(new RevokedJwt(jwt));
    }
}
