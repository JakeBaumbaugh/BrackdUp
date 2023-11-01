package tournament.rest;

import java.util.List;
import java.util.Optional;

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

import tournament.model.Profile;
import tournament.model.Song;
import tournament.model.Tournament;
import tournament.model.TournamentBuilder;
import tournament.model.TournamentRound;
import tournament.model.TournamentSettings;
import tournament.model.TournamentSummary;
import tournament.rest.request.VoteRequestBody;
import tournament.service.ProfileService;
import tournament.service.TournamentService;

@RestController
public class TournamentController {
    private static final Logger logger = LoggerFactory.getLogger(TournamentController.class);

    private TournamentService tournamentService;
    private ProfileService profileService;

    @Autowired
    public TournamentController(TournamentService tournamentService, ProfileService profileService) {
        this.tournamentService = tournamentService;
        this.profileService = profileService;
    }
    
    @GetMapping("/tournament")
    public Tournament get(@RequestParam(required = false) Integer id, @RequestParam(required = false) String name) {
        logger.info("GET request for tournament id={}, name={}", id, name);
        Optional<Tournament> tournament;
        if (id != null) {
            logger.info("Finding tournament by id {}", id);
            tournament = tournamentService.getTournament(id);
        } else {
            logger.info("Finding tournament by name {}", name);
            tournament = tournamentService.getTournament(name);
        }
        return tournament.orElseThrow(() -> create404("Tournament not found."));
    }

    @GetMapping("/tournaments")
    public List<TournamentSummary> get() {
        logger.info("GET request for all tournaments");
        return tournamentService.getTournaments();
    }

    @PostMapping("/tournament/vote")
    public void vote(Authentication authentication, @RequestBody VoteRequestBody body) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to vote on tournament id={} from user {}", body.getTournament(), profile.getName());
        
        if (!profileService.profileCanVote(profile, body.getTournament())) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        Tournament tournament = tournamentService.getTournament(body.getTournament())
                .orElseThrow(() -> create400("Tournament not found."));
        TournamentRound activeRound = tournament.getVotableRound()
                .orElseThrow(() -> create400("Tournament does not have an active round."));
        List<Song> songs = tournamentService.getSongs(body.getSongs());
        if(!activeRound.validSongVotes(songs)) {
            throw create400("Songs did not match active round.");
        }

        tournamentService.vote(profile, activeRound, songs);
    }

    @GetMapping("/tournament/vote")
    public List<Integer> getVotedSongIds(Authentication authentication, @RequestParam Integer tournamentId) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("GET request for votes cast on tournament id={} from user {}", tournamentId, profile.getName());

        if (!profileService.profileCanVote(profile, tournamentId)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        Tournament tournament = tournamentService.getTournament(tournamentId)
                .orElseThrow(() -> create400("Tournament not found."));
        TournamentRound activeRound = tournament.getVotableRound()
                .orElseThrow(() -> create400("Tournament does not have an active round."));
        
        return tournamentService.getVotedSongIds(profile, activeRound);
    }

    @GetMapping("/tournament/create")
    public Integer newTournament(Authentication authentication, @RequestParam String name) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("GET request to create a new sample tournament.");

        if (!profileService.profileCanCreate(profile)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        return tournamentService.generateTournament(name).getId();
    }

    @PostMapping("/tournament/create")
    public void createTournament(Authentication authentication, @RequestBody TournamentBuilder builder) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to create tournament {} from user {}", builder.getName(), profile.getName());

        if (!profileService.profileCanCreate(profile)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        tournamentService.createTournament(builder);
    }

    @DeleteMapping("/tournament/delete")
    public void deleteTournament(Authentication authentication, @RequestParam Integer id) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("DELETE request to delete tournament id={} from user {}", id, profile.getName());

        if (!profileService.profileCanEdit(profile)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        if (tournamentService.getTournament(id).isEmpty()) {
            throw create400("Tournament not found.");
        }
        tournamentService.deleteTournament(id);
    }

    @GetMapping("/song/search")
    public List<Song> searchSongs(@RequestParam(required = false) String title, @RequestParam(required = false) String artist) {
        logger.info("GET request to search songs for title={} and artist={}", title, artist);
        return tournamentService.searchSongs(title, artist);
    }

    @GetMapping("tournament/settings")
    public TournamentSettings getTournamentSettings(Authentication authentication, @RequestParam Integer tournamentId) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("GET request to get settings for tournament {} from user {}", tournamentId, profile.getName());

        if (!profileService.profileCanEdit(profile)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        return tournamentService.getTournamentSettings(tournamentId);
    }

    @PostMapping("tournament/settings")
    public void saveTournamentSettings(Authentication authentication, @RequestBody TournamentSettings settings) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to save settings for tournament {} from user {}", settings.getTournamentId(), profile.getName());

        if (!profileService.profileCanEdit(profile)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        tournamentService.saveTournamentSettings(settings);
    }

    private ResponseStatusException create404(String message) {
        return new ResponseStatusException(HttpStatusCode.valueOf(404), message);
    }

    private ResponseStatusException create400(String message) {
        return new ResponseStatusException(HttpStatusCode.valueOf(400), message);
    }
}
