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
import tournament.model.Song;
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
                .filter(vote -> vote.getSong() != null
                                && (vote.getSong().equals(match.getSong1()) || vote.getSong().equals(match.getSong2())))
                .toList();
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

    public void resolveMatch(TournamentMatch match) {
        logger.debug("Selecting a winner for match {}", match.getId());

        Song song1 = match.getSong1();
        Song song2 = match.getSong2();
        List<Vote> votes = findValidVotesByMatch(match);
        
        List<Vote> song1Votes = new ArrayList<>();
        List<Vote> song2Votes = new ArrayList<>();
        votes.forEach(vote -> {
            if (vote.getSong().equals(song1)) {
                song1Votes.add(vote);
            } else {
                song2Votes.add(vote);
            }
        });
        
        match.setSong1VoteCount(song1Votes.size());
        match.setSong2VoteCount(song2Votes.size());

        Song winner;
        if (song1Votes.size() > song2Votes.size()) {
            winner = song1;
        } else if (song2Votes.size() > song1Votes.size()) {
            winner = song2;
        } else {
            // Handle tie
            Optional<Vote> lastVote = votes.stream().max((vote1, vote2) -> vote1.getTimestamp().compareTo(vote2.getTimestamp()));
            if (lastVote.isPresent()) {
                Song lastVoteSong = lastVote.get().getSong();
                winner = lastVoteSong.equals(song1) ? song2 : song1;
            } else {
                // No votes recorded, select randomly
                winner = Math.random() > 0.5 ? song1 : song2;
            }
        }
        match.setSongWinner(winner);

        logger.debug("Selected song \"{}\" as winner for match {}", match.getSongWinnerTitle(), match.getId());
    }

    public void resolveRound(TournamentRound round) {
        round.getMatches().forEach(this::resolveMatch);
    }

    public void submitVotes(Profile profile, TournamentRound round, List<Song> songs) {
        // Cognitive and runtime complexity could be cleaned up here, refactor if needed

        // Get old vote objects
        List<VoteId> voteIds = round.getMatches()
                .stream()
                .map(match -> new VoteId(profile, match))
                .toList();
        List<Vote> oldVotes = findAllById(voteIds);

        // Create new vote objects
        List<Vote> votes = songs.stream().map(song -> {
            TournamentMatch match = round.getMatches()
                    .stream()
                    .filter(m -> m.getSong1().equals(song) || m.getSong2().equals(song))
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
            if(!song.equals(vote.getSong())) {
                vote.setSong(song);
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

    public Tournament fillVoteCounts(Tournament tournament) {
        tournament.getLevels()
                .stream()
                .flatMap(level -> level.getRounds().stream()) // Get all rounds in tournament
                .filter(round -> round.getStatus() == RoundStatus.RESOLVED) // Filter only resolved rounds
                .flatMap(round -> round.getMatches().stream()) // Get all matches in resolved rounds
                .filter(match -> match.getSong1VoteCount() == null || match.getSong2VoteCount() == null) // Filter only matches without vote counts
                .forEach(match -> {
                    // Find votes for song 1 and song 2
                    List<Vote> votes = findValidVotesByMatch(match);
                    List<Vote> song1Votes = new ArrayList<>();
                    List<Vote> song2Votes = new ArrayList<>();
                    votes.forEach(vote -> {
                        if (vote.getSong().equals(match.getSong1())) {
                            song1Votes.add(vote);
                        } else {
                            song2Votes.add(vote);
                        }
                    });
                    // Populate vote counts
                    match.setSong1VoteCount(song1Votes.size());
                    match.setSong2VoteCount(song2Votes.size());
                    logger.debug("Set {} votes for song 1 and {} votes for song 2 for match {} in tournament {}",
                            song1Votes.size(), song2Votes.size(), match.getId(), tournament.getId());
                });
        return tournament;
    }
}
