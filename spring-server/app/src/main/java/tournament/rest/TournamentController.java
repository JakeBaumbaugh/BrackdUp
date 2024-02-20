package tournament.rest;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import tournament.model.Image;
import tournament.model.Profile;
import tournament.model.Song;
import tournament.model.Tournament;
import tournament.model.TournamentBuilder;
import tournament.model.TournamentRound;
import tournament.model.TournamentSettings;
import tournament.model.TournamentSummary;
import tournament.rest.request.VoteRequestBody;
import tournament.rest.response.VoteResponseBody;
import tournament.service.ImageService;
import tournament.service.ProfileService;
import tournament.service.TournamentService;

@RestController
public class TournamentController {
    private static final Logger logger = LoggerFactory.getLogger(TournamentController.class);

    private TournamentService tournamentService;
    private ProfileService profileService;
    private ImageService imageService;

    @Autowired
    public TournamentController(TournamentService tournamentService, ProfileService profileService, ImageService imageService) {
        this.tournamentService = tournamentService;
        this.profileService = profileService;
        this.imageService = imageService;
    }
    
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

    @GetMapping("/tournaments")
    public List<TournamentSummary> get(Authentication authentication) {
        Profile profile = authentication != null ? (Profile) authentication.getPrincipal() : null;
        logger.info("GET request for all tournaments from user {}", profile != null ? profile.getName() : null);

        return tournamentService.getTournaments(profile);
    }

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
        List<Song> songs = tournamentService.getSongs(body.getSongs());
        if(!activeRound.validSongVotes(songs)) {
            throw create400("Songs did not match active round.");
        }

        boolean roundEnded = tournamentService.vote(profile, activeRound, songs, tournament);
        return new VoteResponseBody(roundEnded);
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

    @GetMapping("/song/search")
    public List<Song> searchSongs(@RequestParam(required = false) String title, @RequestParam(required = false) String artist) {
        logger.info("GET request to search songs for title={} and artist={}", title, artist);
        return tournamentService.searchSongs(title, artist);
    }

    @GetMapping("tournament/settings")
    public TournamentSettings getTournamentSettings(Authentication authentication, @RequestParam Integer tournamentId) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("GET request to get settings for tournament {} from user {}", tournamentId, profile.getName());

        if (!profileService.profileCanEdit(profile, tournamentId)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        return tournamentService.getTournamentSettings(tournamentId);
    }

    @PostMapping("tournament/settings")
    public void saveTournamentSettings(Authentication authentication, @RequestBody TournamentSettings settings) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("POST request to save settings for tournament {} from user {}", settings.getTournamentId(), profile.getName());

        if (!profileService.profileCanEdit(profile, settings.getTournamentId())) {
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
