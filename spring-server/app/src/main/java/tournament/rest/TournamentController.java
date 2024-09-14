package tournament.rest;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import tournament.model.Entry;
import tournament.model.Profile;
import tournament.model.Tournament;
import tournament.model.TournamentBuilder;
import tournament.model.TournamentRound;
import tournament.model.TournamentSettings;
import tournament.model.TournamentSummary;
import tournament.model.TournamentType;
import tournament.rest.request.VoteRequestBody;
import tournament.rest.request.VotesRequestBody;
import tournament.rest.response.VoteResponseBody;
import tournament.service.ProfileService;
import tournament.service.TournamentService;
import tournament.service.TournamentTypeService;

@RestController
public class TournamentController {
    private static final Logger logger = LoggerFactory.getLogger(TournamentController.class);

    private TournamentService tournamentService;
    private ProfileService profileService;
    private TournamentTypeService tournamentTypeService;

    @Autowired
    public TournamentController(TournamentService tournamentService, ProfileService profileService, TournamentTypeService tournamentTypeService) {
        this.tournamentService = tournamentService;
        this.profileService = profileService;
        this.tournamentTypeService = tournamentTypeService;
    }
    
    // Retrieve tournament data
    @GetMapping("/tournament")
    public Tournament get(Authentication authentication, @RequestParam Integer id) {
        Profile profile = authentication != null ? (Profile) authentication.getPrincipal() : null;
        logger.info("GET request for tournament id={} from user {}", id, profile != null ? profile.getName() : null);

        if (!profileService.profileCanView(profile, id)) {
            throw create404("Tournament not found.");
        }

        return tournamentService.getTournament(id)
                .orElseThrow(() -> create404("Tournament not found."));
    }

    // Retrieve summary of tournaments for home page
    @GetMapping("/tournaments")
    public List<TournamentSummary> get(Authentication authentication) {
        Profile profile = authentication != null ? (Profile) authentication.getPrincipal() : null;
        logger.info("GET request for all tournaments from user {}", profile != null ? profile.getName() : null);

        return tournamentService.getTournaments(profile);
    }

    // Get votes by user on tournament
    @GetMapping("/tournament/vote")
    public List<Integer> getVotedEntryIds(Authentication authentication, @RequestParam Integer tournamentId) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("GET request for votes cast on tournament id={} from user {}", tournamentId, profile.getName());

        if (!profileService.profileCanVote(profile, tournamentId)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        Tournament tournament = tournamentService.getTournament(tournamentId)
                .orElseThrow(() -> create400("Tournament not found."));
        TournamentRound activeRound = tournament.getVotableRound()
                .orElseThrow(() -> create400("Tournament does not have an active round."));
        
        return tournamentService.getVotedEntryIds(profile, activeRound);
    }

    // Submit list of votes for matches
    @Deprecated
    @PostMapping("/tournament/votes")
    public VoteResponseBody vote(Authentication authentication, @RequestBody VotesRequestBody body) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to vote on tournament id={} from user {}", body.getTournament(), profile.getName());
        
        if (!profileService.profileCanVote(profile, body.getTournament())) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        Tournament tournament = tournamentService.getTournament(body.getTournament())
                .orElseThrow(() -> create400("Tournament not found."));
        TournamentRound activeRound = tournament.getVotableRound()
                .orElseThrow(() -> create400("Tournament does not have an active round."));
        List<Entry> entries = tournamentService.getEntries(body.getEntries());
        if(!activeRound.validEntryVotes(entries)) {
            throw create400("Entries do not match active round.");
        }

        boolean roundEnded = tournamentService.vote(profile, activeRound, entries, tournament);
        return new VoteResponseBody(roundEnded);
    }

    // Submit single vote for match
    @PostMapping("/tournament/vote")
    public VoteResponseBody vote(Authentication authentication, @RequestBody VoteRequestBody body) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to vote on tournament id={} from user {}", body.getTournament(), profile.getName());

        if (!profileService.profileCanVote(profile, body.getTournament())) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        Tournament tournament = tournamentService.getTournament(body.getTournament())
                .orElseThrow(() -> create400("Tournament not found."));
        TournamentRound activeRound = tournament.getVotableRound()
                .orElseThrow(() -> create400("Tournament does not have an active round."));
        if (!activeRound.entryInRound(body.getEntry())) {
            throw create400("Entry does not match active round.");
        }

        boolean roundEnded = tournamentService.vote(profile, activeRound, body.getEntry(), tournament);
        return new VoteResponseBody(roundEnded);
    }

    // Remove single vote for match
    @PostMapping("/tournament/removeVote")
    public VoteResponseBody removeVote(Authentication authentication, @RequestBody VoteRequestBody body) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to remove vote on tournament id={} from user {}", body.getTournament(), profile.getName());

        if (!profileService.profileCanVote(profile, body.getTournament())) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        Tournament tournament = tournamentService.getTournament(body.getTournament())
                .orElseThrow(() -> create400("Tournament not found."));
        TournamentRound activeRound = tournament.getVotableRound()
                .orElseThrow(() -> create400("Tournament does not have an active round."));
        if (!activeRound.entryInRound(body.getEntry())) {
            throw create400("Entry does not match active round.");
        }

        tournamentService.removeVote(profile, activeRound, body.getEntry());
        return new VoteResponseBody(false);
    }

    // Create tournament from builder
    @PostMapping("/tournament/create")
    public void createTournament(Authentication authentication, @RequestBody TournamentBuilder builder) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to create tournament {} from user {}", builder.getName(), profile.getName());

        if (!profileService.profileCanCreate(profile)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        builder.setCreator(profile);
        tournamentService.createTournament(builder);
    }

    // Delete tournament
    @DeleteMapping("/tournament/delete")
    public void deleteTournament(Authentication authentication, @RequestParam Integer tournamentId) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("DELETE request to delete tournament id={} from user {}", tournamentId, profile.getName());

        if (!profileService.profileCanEdit(profile, tournamentId)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        if (tournamentService.getTournament(tournamentId).isEmpty()) {
            throw create400("Tournament not found.");
        }
        tournamentService.deleteTournament(tournamentId);
    }

    // Get tournament settings
    @GetMapping("tournament/settings")
    public TournamentSettings getTournamentSettings(Authentication authentication, @RequestParam Integer tournamentId) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("GET request to get settings for tournament {} from user {}", tournamentId, profile.getName());

        if (!profileService.profileCanEdit(profile, tournamentId)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        return tournamentService.getTournamentSettings(tournamentId);
    }

    // Save tournament settings
    @PostMapping("tournament/settings")
    public void saveTournamentSettings(Authentication authentication, @RequestBody TournamentSettings settings) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to save settings for tournament {} from user {}", settings.getTournamentId(), profile.getName());

        if (!profileService.profileCanEdit(profile, settings.getTournamentId())) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        tournamentService.saveTournamentSettings(settings);
    }

    // Get list of available tournament types
    @GetMapping("tournament/types")
    public List<TournamentType> getTournamentTypes(Authentication authentication) {
        Profile profile = authentication != null ? (Profile) authentication.getPrincipal() : null;
        logger.info("GET request for list of tournament types from user {}", profile != null ? profile.getName() : null);

        return tournamentTypeService.getTypes();
    }

    private ResponseStatusException create404(String message) {
        return new ResponseStatusException(HttpStatusCode.valueOf(404), message);
    }

    private ResponseStatusException create400(String message) {
        return new ResponseStatusException(HttpStatusCode.valueOf(400), message);
    }
}
