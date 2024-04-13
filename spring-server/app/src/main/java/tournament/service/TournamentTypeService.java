package tournament.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tournament.model.TournamentType;
import tournament.repository.TournamentTypeRepository;

@Service
public class TournamentTypeService {
    
    private TournamentTypeRepository tournamentTypeRepository;

    @Autowired
    public TournamentTypeService(TournamentTypeRepository tournamentTypeRepository) {
        this.tournamentTypeRepository = tournamentTypeRepository;
    }

    public List<TournamentType> getTypes() {
        return tournamentTypeRepository.findAll();
    }

    public Optional<TournamentType> getType(String type) {
        return tournamentTypeRepository.findById(type);
    }

    public boolean isType(String type) {
        return tournamentTypeRepository.findById(type).isPresent();
    }

    public TournamentType validateType(String type) {
        // Validate type, use MISC as fallback
        return getType(type)
                .or(() -> getType("MISC"))
                .orElse(null);
    }
}
