package tournament.rest;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import tournament.model.Profile;
import tournament.model.Song;
import tournament.model.Tournament;
import tournament.model.TournamentRound;
import tournament.model.TournamentSummary;
import tournament.rest.request.VoteRequestBody;
import tournament.service.TournamentService;

@RestController
public class TournamentController {
    private static final Logger logger = LoggerFactory.getLogger(TournamentController.class);

    private TournamentService tournamentService;

    @Autowired
    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
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
        logger.info("POST request to vote on tournament id={} from user={}", body.getTournament(), profile.getName());

        Tournament tournament = tournamentService.getTournament(body.getTournament())
                .orElseThrow(() -> create400("Tournament not found."));
        TournamentRound currentRound = tournament.getCurrentRound()
                .orElseThrow(() -> create400("Tournament does not have an active round."));
        List<Song> songs = tournamentService.getSongs(body.getSongs());
        if(!currentRound.validSongVotes(songs)) {
            throw create400("Songs did not match active round.");
        }

        tournamentService.vote(profile, currentRound, songs);
    }

    private ResponseStatusException create404(String message) {
        return new ResponseStatusException(HttpStatusCode.valueOf(404), message);
    }

    private ResponseStatusException create400(String message) {
        return new ResponseStatusException(HttpStatusCode.valueOf(400), message);
    }
}
