package tournament.repository;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.TournamentVoter;
import tournament.model.TournamentVoterId;

public interface TournamentVoterRepository extends ListCrudRepository<TournamentVoter, TournamentVoterId> {
    List<TournamentVoter> findAllByTournamentId(Integer tournamentId);
    List<TournamentVoter> findAllByEmail(String email);
    long deleteByTournamentId(Integer tournamentId);
    long deleteAllByProfileId(Integer profileId);
}
