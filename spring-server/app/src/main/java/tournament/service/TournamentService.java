package tournament.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tournament.model.Tournament;
import tournament.model.TournamentSummary;
import tournament.repository.TournamentRepository;

@Service
public class TournamentService {
    
    private TournamentRepository tournamentRepository;

    @Autowired
    public TournamentService(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    public Optional<Tournament> getTournament(Integer id) {
        return tournamentRepository.findById(id);
    }

    public Optional<Tournament> getTournament(String name) {
        return tournamentRepository.findByName(name);
    }

    public List<TournamentSummary> getTournaments() {
        return tournamentRepository.findAll()
            .stream()
            .map(Tournament::getTournamentSummary)
            .toList();
    }
}
