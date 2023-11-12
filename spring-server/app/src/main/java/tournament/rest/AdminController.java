package tournament.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import tournament.model.Profile;
import tournament.model.Tournament;
import tournament.service.TournamentService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    private TournamentService tournamentService;

    @Autowired
    public AdminController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @GetMapping("/randomTournament")
    public Integer randomTournament(Authentication authentication, @RequestParam String name) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("GET request to generate a random tournament from user {}", profile.getName());

        if (!profile.isAdmin()) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        return tournamentService.generateTournament(name).getId();
    }
    
    @GetMapping("/fillVoteCounts")
    public void fillVoteCounts(Authentication authentication, @RequestParam Integer tournamentId) {
        Profile profile = (Profile) authentication.getPrincipal();
        logger.info("GET request to fill vote counts for tournament {} from user {}", tournamentId, profile.getName());

        if (!profile.isAdmin()) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403));
        }

        Tournament tournament = tournamentService.getTournament(tournamentId)
                .orElseThrow(() -> create400("Tournament not found."));
        
        tournamentService.fillVoteCounts(tournament);
    }

    private ResponseStatusException create400(String message) {
        return new ResponseStatusException(HttpStatusCode.valueOf(400), message);
    }
}
