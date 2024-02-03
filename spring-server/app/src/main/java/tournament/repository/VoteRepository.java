package tournament.repository;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.TournamentMatch;
import tournament.model.Vote;
import tournament.model.VoteId;

public interface VoteRepository extends ListCrudRepository<Vote, VoteId> {
    List<Vote> findByMatch(TournamentMatch match);
    List<Vote> findByMatchIn(List<TournamentMatch> matches);
    long deleteAllByProfileId(Integer profileId);
}
