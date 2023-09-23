package tournament.repository;

import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.Tournament;

public interface TournamentRepository extends ListCrudRepository<Tournament, Integer> {
    Optional<Tournament> findByName(String name);
}
