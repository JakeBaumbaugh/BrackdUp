package tournament.service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

@Service
public class TournamentService {
    private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);

    @Value("${resolve.delay.seconds:15}")
    private Integer resolveDelaySeconds;

    @Value("${start.delay.seconds:1}")
    private Integer startDelaySeconds;
    
    private ProfileService profileService;
    private VoteService voteService;
    private TournamentRepository tournamentRepository;
    private SongRepository songRepository;
    private TournamentVoterRepository tournamentVoterRepository;
    private TournamentFactory tournamentFactory;
    private ThreadPoolTaskScheduler threadPoolTaskScheduler;

    @Autowired
    public TournamentService(ProfileService profileService,
                             TournamentRepository tournamentRepository,
                             SongRepository songRepository,
                             VoteService voteService,
                             TournamentVoterRepository tournamentVoterRepository,
                             TournamentFactory tournamentFactory,
                             ThreadPoolTaskScheduler threadPoolTaskScheduler) {
        this.profileService = profileService;
        this.tournamentRepository = tournamentRepository;
        this.songRepository = songRepository;
        this.voteService = voteService;
        this.tournamentVoterRepository = tournamentVoterRepository;
        this.tournamentFactory = tournamentFactory;
        this.threadPoolTaskScheduler = threadPoolTaskScheduler;
    }

    @EventListener @Transactional
    public void scheduleInitialResolves(ContextRefreshedEvent event) {
        // TODO: Resolve any active non-votable rounds
        ZonedDateTime now = ZonedDateTime.now();
        // Schedule initial starts and resolves
        tournamentRepository.findAll()
                .forEach(tournament -> {
                    tournament.getVotableRound()
                            .ifPresent(round -> {
                                logger.info("Scheduling initial resolve for round {} in tournament {}.", round.getId(), tournament.getId());
                                scheduleRoundResolve(tournament, round);
                            });
                    if (tournament.getStartDate().isAfter(now)) {
                        scheduleTournamentStart(tournament);
                    } else if (tournament.getLevels().get(0).getRounds().get(0).getStatus() == RoundStatus.CREATED) {
                        startTournament(tournament);
                    }
                });
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

    @Transactional
    public void deleteTournament(Integer id) {
        tournamentVoterRepository.deleteByTournamentId(id);
        tournamentRepository.deleteById(id);
    }

    public void createTournament(TournamentBuilder builder) {
        Tournament tournament = tournamentFactory.buildTournament(builder);
        logger.info("Created tournament: {}", tournament);
        if(tournament != null) {
            tournament = tournamentRepository.save(tournament);
            if (tournament.getRoundByCurrentDate().isPresent()) {
                startTournament(tournament);
            } else {
                scheduleTournamentStart(tournament);
            }
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
        List<Vote> votes = voteService.findAllById(voteIds);
        return votes.stream()
                .map(vote -> vote.getSong().getId())
                .toList();
    }

    public void vote(Profile profile, TournamentRound round, List<Song> songs) {
        voteService.submitVotes(profile, round, songs);
    }

    public List<TournamentVoter> getVotersForTournament(Integer tournamentId) {
        Optional<Tournament> optionalTournament = getTournament(tournamentId);
        if (optionalTournament.isEmpty()) {
            return List.of();
        }
        List<TournamentVoter> voters = tournamentVoterRepository.findAllByTournamentId(tournamentId);
        // Check if voters have voted for the current votable round
        optionalTournament.get().getVotableRound().ifPresent(round -> {
            List<Vote> roundVotes = voteService.findByRound(round);
            voters.forEach(voter -> {
                Profile profile = voter.getProfile();
                voter.setHasVoted(profile != null && roundVotes.stream().anyMatch(vote -> vote.getProfile().equals(profile)));
            });
        });
        return voters;
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

    public void fillVoteCounts(Tournament tournament) {
        tournament = voteService.fillVoteCounts(tournament);
        if (tournament != null) {
            tournamentRepository.save(tournament);
        }
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
        voteService.resolveRound(round);

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
            logger.info("Attempting to resolve round {} for tournament {}.", round.getId(), tournament.getId());
            resolveRound(tournament.getId(), round.getId());
        }, scheduleTime.toInstant());
    }

    private boolean startTournament(Tournament tournament) {
        TournamentRound firstRound = tournament.getLevels().get(0).getRounds().get(0);
        if (firstRound.getStatus() == RoundStatus.CREATED) {
            firstRound.setStatus(RoundStatus.ACTIVE);
            tournamentRepository.save(tournament);
            logger.info("Successfully started first round of tournament {}", tournament.getId());
            scheduleRoundResolve(tournament, firstRound);
            return true;
        } else {
            logger.warn("Cannot start tournament {}, tournament has already been started.", tournament.getId());
            return false;
        }
    }

    private boolean startTournament(Integer tournamentId) {
        try {
            Tournament tournament = getTournament(tournamentId).orElseThrow();
            return startTournament(tournament);
        } catch (Exception e) {
            logger.error("Encountered exception trying to begin the first round of tournament {}: {}", tournamentId, e);
            return false;
        }
    }

    private void scheduleTournamentStart(Tournament tournament) {
        TournamentRound firstRound = tournament.getLevels().get(0).getRounds().get(0);
        ZonedDateTime scheduleTime = firstRound.getStartDate().plusSeconds(startDelaySeconds);
        logger.info("Scheduling start of tournament {} at {}.", tournament.getId(), scheduleTime);
        threadPoolTaskScheduler.schedule(() -> {
            logger.info("Attempting to start tournament {}.", tournament.getId());
            startTournament(tournament.getId());
        }, scheduleTime.toInstant());
    }
}
