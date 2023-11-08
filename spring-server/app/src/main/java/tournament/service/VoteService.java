package tournament.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tournament.model.TournamentMatch;
import tournament.model.TournamentRound;
import tournament.model.Vote;
import tournament.model.VoteId;
import tournament.repository.VoteRepository;

@Service
public class VoteService {
    
    VoteRepository voteRepository;

    @Autowired
    public VoteService(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
    }

    public List<Vote> findAllById(List<VoteId> ids) {
        return voteRepository.findAllById(ids);
    }

    public List<Vote> findByMatch(TournamentMatch match) {
        return voteRepository.findByMatch(match);
    }

    public List<Vote> findByRound(TournamentRound round) {
        return voteRepository.findByMatchIn(round.getMatches());
    }

    public List<Vote> saveAll(List<Vote> votes) {
        return voteRepository.saveAll(votes);
    }

    public void deleteAll(List<Vote> votes) {
        voteRepository.deleteAll(votes);
    }
}
