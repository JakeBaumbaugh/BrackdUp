package tournament.repository;

import org.springframework.data.repository.ListCrudRepository;

import tournament.model.Vote;
import tournament.model.VoteId;

public interface VoteRepository extends ListCrudRepository<Vote, VoteId> {
    
}
