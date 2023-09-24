package tournament.rest;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import tournament.model.Tournament;
import tournament.model.TournamentSummary;
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
    @CrossOrigin(originPatterns = "*:[*]")
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
    @CrossOrigin(originPatterns = "*:[*]")
    public List<TournamentSummary> get() {
        logger.info("GET request for all tournaments");
        return tournamentService.getTournaments();
    }

    private ResponseStatusException create404(String message) {
        return new ResponseStatusException(HttpStatusCode.valueOf(404), message);
    }
}
