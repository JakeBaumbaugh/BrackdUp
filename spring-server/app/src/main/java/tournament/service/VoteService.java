package tournament.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tournament.model.Profile;
import tournament.model.RoundStatus;
import tournament.model.Entry;
import tournament.model.Tournament;
import tournament.model.TournamentMatch;
import tournament.model.TournamentRound;
import tournament.model.Vote;
import tournament.model.VoteId;
import tournament.repository.VoteRepository;

@Service
public class VoteService {
    private static final Logger logger = LoggerFactory.getLogger(VoteService.class);
    
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

    public List<Vote> findValidVotesByMatch(TournamentMatch match) {
        return findByMatch(match)
                .stream()
                .filter(vote -> vote.getEntry() != null
                                && (vote.getEntry().equals(match.getEntry1()) || vote.getEntry().equals(match.getEntry2())))
                .toList();
    }

    public List<Vote> findByRound(TournamentRound round) {
        return voteRepository.findByMatchIn(round.getMatches());
    }

    public List<Vote> findByRound(TournamentRound round, Profile profile) {
        List<VoteId> voteIds = round.getMatches()
                .stream()
                .map(match -> new VoteId(profile, match))
                .toList();
        return findAllById(voteIds);
    }

    public List<Vote> saveAll(List<Vote> votes) {
        return voteRepository.saveAll(votes);
    }

    public void deleteAll(List<Vote> votes) {
        voteRepository.deleteAll(votes);
    }

    public void resolveMatch(TournamentMatch match) {
        logger.debug("Selecting a winner for match {}", match.getId());

        Entry entry1 = match.getEntry1();
        Entry entry2 = match.getEntry2();
        List<Vote> votes = findValidVotesByMatch(match);
        
        List<Vote> entry1Votes = new ArrayList<>();
        List<Vote> entry2Votes = new ArrayList<>();
        votes.forEach(vote -> {
            if (vote.getEntry().equals(entry1)) {
                entry1Votes.add(vote);
            } else {
                entry2Votes.add(vote);
            }
        });
        
        match.setEntry1VoteCount(entry1Votes.size());
        match.setEntry2VoteCount(entry2Votes.size());
        logger.info("Found {} votes for entry 1 and {} votes for entry 2 for match {}", entry1Votes.size(), entry2Votes.size(), match.getId());

        Entry winner;
        if (entry1Votes.size() > entry2Votes.size()) {
            winner = entry1;
        } else if (entry2Votes.size() > entry1Votes.size()) {
            winner = entry2;
        } else {
            // Handle tie
            Optional<Vote> lastVote = votes.stream().max((vote1, vote2) -> vote1.getTimestamp().compareTo(vote2.getTimestamp()));
            if (lastVote.isPresent()) {
                Entry lastVoteEntry = lastVote.get().getEntry();
                winner = lastVoteEntry.equals(entry1) ? entry2 : entry1;
            } else {
                // No votes recorded, select randomly
                winner = Math.random() > 0.5 ? entry1 : entry2;
            }
        }
        match.setEntryWinner(winner);

        logger.debug("Selected entry \"{}\" as winner for match {}", match.getEntryWinnerLine1(), match.getId());
    }

    public void resolveRound(TournamentRound round) {
        round.getMatches().forEach(this::resolveMatch);
    }

    public void submitVotes(Profile profile, TournamentRound round, List<Entry> entries) {
        // Cognitive and runtime complexity could be cleaned up here, refactor if needed

        // Get old vote objects
        List<Vote> oldVotes = findByRound(round, profile);

        // Create new vote objects
        List<Vote> votes = entries.stream().map(entry -> {
            TournamentMatch match = round.getMatches()
                    .stream()
                    .filter(m -> m.getEntry1().equals(entry) || m.getEntry2().equals(entry))
                    .findFirst()
                    .get();
            
            Vote vote = oldVotes.stream()
                    .filter(oldVote -> oldVote.getProfile().equals(profile) && oldVote.getMatch().equals(match))
                    .findFirst()
                    .orElseGet(() -> {
                        Vote newVote = new Vote();
                        newVote.setProfile(profile);
                        newVote.setMatch(match);
                        return newVote;
                    });
            if(!entry.equals(vote.getEntry())) {
                vote.setEntry(entry);
                vote.setTimestamp();
            }
            return vote;
        }).toList();

        // Save new vote objects
        saveAll(votes);

        // Remove old vote objects without new votes for its match
        List<Vote> removeVotes = oldVotes.stream()
                .filter(oldVote -> votes.stream().noneMatch(vote -> vote.getMatch().equals(oldVote.getMatch())))
                .toList();
        deleteAll(removeVotes);
    }

    public void submitVote(Profile profile, TournamentRound round, Entry entry) {
        // Skip if vote already exists
        boolean alreadyContainsEntry = findByRound(round, profile)
                .stream()
                .anyMatch(vote -> vote.getEntry().equals(entry));
        if (alreadyContainsEntry) {
            return;
        }

        // Remove old vote for match
        TournamentMatch match = round.getMatches()
                    .stream()
                    .filter(m -> m.getEntry1().equals(entry) || m.getEntry2().equals(entry))
                    .findFirst()
                    .get();
        voteRepository.deleteById(new VoteId(profile, match));

        // Save vote for entry
        Vote vote = new Vote();
        vote.setProfile(profile);
        vote.setMatch(match);
        vote.setEntry(entry);
        vote.setTimestamp();
        voteRepository.save(vote);
    }

    public Tournament fillVoteCounts(Tournament tournament) {
        tournament.getLevels()
                .stream()
                .flatMap(level -> level.getRounds().stream()) // Get all rounds in tournament
                .filter(round -> round.getStatus() == RoundStatus.RESOLVED) // Filter only resolved rounds
                .flatMap(round -> round.getMatches().stream()) // Get all matches in resolved rounds
                .filter(match -> match.getEntry1VoteCount() == null || match.getEntry2VoteCount() == null) // Filter only matches without vote counts
                .forEach(match -> {
                    // Find votes for entry 1 and entry 2
                    List<Vote> votes = findValidVotesByMatch(match);
                    List<Vote> entry1Votes = new ArrayList<>();
                    List<Vote> entry2Votes = new ArrayList<>();
                    votes.forEach(vote -> {
                        if (vote.getEntry().equals(match.getEntry1())) {
                            entry1Votes.add(vote);
                        } else {
                            entry2Votes.add(vote);
                        }
                    });
                    // Populate vote counts
                    match.setEntry1VoteCount(entry1Votes.size());
                    match.setEntry2VoteCount(entry2Votes.size());
                    logger.debug("Set {} votes for entry 1 and {} votes for entry 2 for match {} in tournament {}",
                            entry1Votes.size(), entry2Votes.size(), match.getId(), tournament.getId());
                });
        return tournament;
    }
}
