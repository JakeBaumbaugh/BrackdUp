package tournament.repository;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.TournamentType;

public interface TournamentTypeRepository extends ListCrudRepository<TournamentType, String> {
    
}
