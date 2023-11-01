package tournament.service;

import java.time.ZonedDateTime;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;
import tournament.model.*;
import tournament.repository.SongRepository;
import tournament.repository.TournamentRepository;
import tournament.repository.TournamentVoterRepository;
import tournament.repository.VoteRepository;

@Service
public class TournamentService {
    private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);

    @Value("${resolve.delay.seconds:15}")
    private Integer resolveDelaySeconds;
    
    private ProfileService profileService;
    private TournamentRepository tournamentRepository;
    private SongRepository songRepository;
    private VoteRepository voteRepository;
    private TournamentVoterRepository tournamentVoterRepository;
    private TournamentFactory tournamentFactory;
    private ThreadPoolTaskScheduler threadPoolTaskScheduler;

    @Autowired
    public TournamentService(ProfileService profileService,
                             TournamentRepository tournamentRepository,
                             SongRepository songRepository,
                             VoteRepository voteRepository,
                             TournamentVoterRepository tournamentVoterRepository,
                             TournamentFactory tournamentFactory,
                             ThreadPoolTaskScheduler threadPoolTaskScheduler) {
        this.profileService = profileService;
        this.tournamentRepository = tournamentRepository;
        this.songRepository = songRepository;
        this.voteRepository = voteRepository;
        this.tournamentVoterRepository = tournamentVoterRepository;
        this.tournamentFactory = tournamentFactory;
        this.threadPoolTaskScheduler = threadPoolTaskScheduler;
    }

    @EventListener @Transactional
    public void scheduleInitialResolves(ContextRefreshedEvent event) {
        // TODO: Resolve any active non-votable rounds
        // Schedule initial resolves
        tournamentRepository.findAll()
                .forEach(tournament -> tournament.getVotableRound()
                        .ifPresent(round -> {
                            logger.info("Scheduling initial resolve for round {} in tournament {}.", round.getId(), tournament.getId());
                            scheduleRoundResolve(tournament, round);
                        }));
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

    public void deleteTournament(Integer id) {
        tournamentRepository.deleteById(id);
    }

    public void createTournament(TournamentBuilder builder) {
        Tournament tournament = tournamentFactory.buildTournament(builder);
        logger.info("Created tournament: {}", tournament);
        if(tournament != null) {
            tournamentRepository.save(tournament);
        }
    }

    public Tournament generateTournament(String name) {
        Tournament tournament = tournamentFactory.buildDefaulTournament(name);
        scheduleRoundResolve(tournament, tournament.getLevels().get(0).getRounds().get(0));
        return tournament;
    }

    public List<Song> getSongs(List<Integer> songIds) {
        return songRepository.findAllById(songIds);
    }

    public List<Song> searchSongs(String title, String artist) {
        boolean titleIsBlank = StringUtils.isBlank(title);
        boolean artistIsBlank = StringUtils.isBlank(artist);
        if(titleIsBlank && artistIsBlank) {
            return List.of();
        }
        if (titleIsBlank) {
            return songRepository.findByArtistContainingIgnoreCase(artist);
        }
        if (artistIsBlank) {
            return songRepository.findByTitleContainingIgnoreCase(title);
        }
        List<Song> titleLike = songRepository.findByTitleContainingIgnoreCase(title);
        List<Song> artistLike = songRepository.findByArtistContainingIgnoreCase(artist);
        titleLike.retainAll(artistLike);
        return titleLike;
    }

    public List<Integer> getVotedSongIds(Profile profile, TournamentRound round) {
        List<VoteId> voteIds = round.getMatches()
                .stream()
                .map(match -> new VoteId(profile, match))
                .toList();
        List<Vote> votes = voteRepository.findAllById(voteIds);
        return votes.stream()
                .map(vote -> vote.getSong().getId())
                .toList();
    }

    public void vote(Profile profile, TournamentRound round, List<Song> songs) {
        // Cognitive and runtime complexity could be cleaned up here, refactor if needed

        // Get old vote objects
        List<VoteId> voteIds = round.getMatches()
                .stream()
                .map(match -> new VoteId(profile, match))
                .toList();
        List<Vote> oldVotes = voteRepository.findAllById(voteIds);

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
        voteRepository.saveAll(votes);

        // Remove old vote objects without new votes for its match
        List<Vote> removeVotes = oldVotes.stream()
                .filter(oldVote -> votes.stream().noneMatch(vote -> vote.getMatch().equals(oldVote.getMatch())))
                .toList();
        voteRepository.deleteAll(removeVotes);
    }

    public List<TournamentVoter> getVotersForTournament(Integer tournamentId) {
        return tournamentVoterRepository.findAllByTournamentId(tournamentId);
    }

    public TournamentSettings getTournamentSettings(Integer tournamentId) {
        List<TournamentVoter> voters = getVotersForTournament(tournamentId);
        return new TournamentSettings(tournamentId, voters);
    }

    public void saveTournamentSettings(TournamentSettings settings) {
        Integer tournamentId = settings.getTournamentId();
        if (tournamentId == null) {
            return;
        }
        // Build maps
        Map<String, TournamentVoter> oldVoters = new HashMap<>();
        getVotersForTournament(tournamentId).forEach(voter -> oldVoters.put(voter.getEmail(), voter));
        Map<String, TournamentVoter> newVoters = new HashMap<>();
        settings.getVoters().forEach(voter -> newVoters.put(voter.getEmail(), voter));

        // Delete removed voters
        List<TournamentVoter> removedVoters = oldVoters
                .values()
                .stream()
                .filter(voter -> !newVoters.containsKey(voter.getEmail()))
                .toList();
        logger.debug("Removing tournament voters: {}", removedVoters);
        tournamentVoterRepository.deleteAll(removedVoters);

        // Map newVoters to database entities or add profiles
        newVoters.keySet().forEach(key -> 
            newVoters.compute(key, (email, voter) -> {
                if (oldVoters.containsKey(email)) {
                    return oldVoters.get(email);
                } else {
                    profileService.findByEmail(email).ifPresent(voter::setProfile);
                    return voter;
                }
            })
        );
        logger.debug("Saving tournament voters: {}", newVoters.values());
        tournamentVoterRepository.saveAll(newVoters.values());
    }

    private void resolveRound(Tournament tournament, TournamentRound round) {
        // Get TournamentLevel to ensure round is in tournament
        List<TournamentLevel> levels = tournament.getLevels();
        TournamentLevel level = levels.stream()
                .filter(l -> l.getRounds().contains(round))
                .findFirst()
                .orElseThrow(() -> {
                    logger.error("Could not find round {} in tournament {}", round.getId(), tournament.getId());
                    return new IllegalArgumentException("Given round not in tournament");
                });
        
        // Resolve votes for round
        round.getMatches().forEach(match -> {
            logger.debug("Selecting a winner for match {}", match.getId());
            List<Vote> votes = voteRepository.findByMatch(match);
            match.decideWinner(votes);
            logger.debug("Selected song as winner: {}", match.getSongWinnerTitle());
        });

        if(round.getMatches().size() > 1) {
            // Generate new matches
            List<TournamentMatch> newMatches = new ArrayList<>();
            logger.debug("New matches created:");
            for(int matchIndex = 0; matchIndex < round.getMatches().size(); matchIndex += 2) {
                TournamentMatch match = new TournamentMatch();
                match.setSong1(round.getMatches().get(matchIndex).getSongWinner());
                match.setSong2(round.getMatches().get(matchIndex+1).getSongWinner());
                newMatches.add(match);
                logger.debug("\"{}\" vs. \"{}\"", match.getSong1().getTitle(), match.getSong2().getTitle());
            }
            
            // Add new matches to resulting round
            int levelIndex = levels.indexOf(level);
            int roundIndex = level.getRounds().indexOf(round);
            TournamentRound resultingRound = levels.get(levelIndex + 1).getRounds().get(roundIndex / 2);
            logger.debug("Adding new matches to round {}.", resultingRound.getId());
            List<TournamentMatch> oldMatches = resultingRound.getMatches() == null ? new ArrayList<>() : resultingRound.getMatches();
            oldMatches.addAll(newMatches);
            resultingRound.setMatches(oldMatches);
        }

        // Update status of resolved round and newly starting round
        round.setStatus(RoundStatus.RESOLVED);
        tournament.getRoundByCurrentDate().ifPresent(startingRound -> {
            logger.debug("Starting round {} for tournament {}.", startingRound.getId(), tournament.getId());
            startingRound.setStatus(RoundStatus.ACTIVE);
            scheduleRoundResolve(tournament, startingRound);
        });

        tournamentRepository.save(tournament);
    }

    private void resolveRound(Integer tournamentId, Integer roundId) {
        try {
            Tournament tournament = getTournament(tournamentId).orElseThrow();
            TournamentRound round = tournament.getRound(roundId).orElseThrow();
            resolveRound(tournament, round);
        } catch (Exception e) {
            logger.error("Encountered exception trying to resolve round {} from tournament {}: {}", roundId, tournamentId, e);
        }
    }

    private void scheduleRoundResolve(Tournament tournament, TournamentRound round) {
        ZonedDateTime scheduleTime = round.getEndDate().plusSeconds(resolveDelaySeconds);
        logger.info("Scheduling resolution of round {} for tournament {} at {}.", round.getId(), tournament.getId(), scheduleTime);
        threadPoolTaskScheduler.schedule(() -> {
            logger.info("Attempting to resolve round {} for tournament {}", round.getId(), tournament.getId());
            resolveRound(tournament.getId(), round.getId());
        }, scheduleTime.toInstant());
    }
}
