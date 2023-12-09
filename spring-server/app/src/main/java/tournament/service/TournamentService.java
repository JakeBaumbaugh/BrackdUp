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
import tournament.model.TournamentSettings.MatchDescription;
import tournament.model.TournamentSettings.RoundDate;
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
                    TournamentRound firstRound = tournament.getLevels().get(0).getRounds().get(0);
                    if (tournament.getStartDate().isAfter(now) || firstRound.getStatus() == RoundStatus.CREATED) {
                        scheduleTournamentStart(tournament);
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
            scheduleTournamentStart(tournament);
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
        Optional<Tournament> optionalTournament = getTournament(tournamentId);
        Optional<TournamentRound> currentRound = optionalTournament
                .map(tournament -> tournament.getRoundByCurrentDate().orElse(null));
        String roundDescription = currentRound
                .map(TournamentRound::getDescription)
                .orElse(null);
        List<MatchDescription> matchDescriptions = currentRound
                .map(round -> round.getMatches()
                        .stream()
                        .map(match -> new MatchDescription(match.getSong1Title(), match.getSong1Description(), match.getSong2Title(), match.getSong2Description()))
                        .toList()
                )
                .orElse(null);
        List<RoundDate> roundDates = optionalTournament
                .map(Tournament::getLevels)
                .orElse(List.of())
                .stream()
                .flatMap(level -> level.getRounds().stream())
                .map(RoundDate::new)
                .toList();
        
        return new TournamentSettings(tournamentId, voters, roundDescription, matchDescriptions, roundDates);
    }

    public void saveTournamentSettings(TournamentSettings settings) {
        Integer tournamentId = settings.getTournamentId();
        if (tournamentId == null) {
            return;
        }
        saveTournamentVoters(tournamentId, settings.getVoters());
        saveRoundDescriptions(tournamentId, settings.getCurrentRoundDescription(), settings.getMatchDescriptions());
        saveRoundDates(tournamentId, settings.getRoundDates());
    }

    public void fillVoteCounts(Tournament tournament) {
        tournament = voteService.fillVoteCounts(tournament);
        if (tournament != null) {
            tournamentRepository.save(tournament);
        }
    }

    private void resolveRound(Integer tournamentId, Integer roundId) {
        // Get tournament and round
        Tournament tournament;
        TournamentRound round;
        try {
            tournament = getTournament(tournamentId).orElseThrow();
            round = tournament.getRound(roundId).orElseThrow();
        } catch (Exception e) {
            logger.error("Encountered exception trying to resolve round {} from tournament {}", roundId, tournamentId, e);
            return;
        }

        // Get TournamentLevel to ensure round is in tournament
        List<TournamentLevel> levels = tournament.getLevels();
        TournamentLevel level = levels.stream()
                .filter(l -> l.getRounds().contains(round))
                .findFirst()
                .orElseThrow(() -> {
                    logger.error("Could not find round {} in tournament {}", roundId, tournamentId);
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
        tournament = tournamentRepository.save(tournament);

        final Tournament finalTournament = tournament;
        tournament.getCurrentOrNextRound().ifPresent(nextRound -> scheduleRoundStart(finalTournament, nextRound));
    }

    private void scheduleRoundResolve(Tournament tournament, TournamentRound round) {
        ZonedDateTime scheduleTime = round.getEndDate().plusSeconds(resolveDelaySeconds);
        logger.info("Scheduling resolution of round {} for tournament {} at {}.", round.getId(), tournament.getId(), scheduleTime);
        threadPoolTaskScheduler.schedule(() -> {
            logger.info("Attempting to resolve round {} for tournament {}.", round.getId(), tournament.getId());
            resolveRound(tournament.getId(), round.getId());
            logger.info("Completed resolving round {} for tournament {}.", round.getId(), tournament.getId());
        }, scheduleTime.toInstant());
    }

    private void startRound(Integer tournamentId, Integer roundId) {
        try {
            Tournament tournament = getTournament(tournamentId).orElseThrow();
            TournamentRound round = tournament.getRound(roundId).orElseThrow();
            if (round.getStatus() == RoundStatus.CREATED) {
                round.setStatus(RoundStatus.ACTIVE);
                tournament = tournamentRepository.save(tournament);
                logger.info("Started round {} for tournament {}.", roundId, tournamentId);
                scheduleRoundResolve(tournament, round);
            } else {
                logger.warn("Could not start round {} for tournament {}, round was already started.", roundId, tournamentId);
            }
        } catch (Exception e) {
            logger.error("Encountered exception trying to start round {} from tournament {}", roundId, tournamentId, e);
        }
    }

    private void scheduleRoundStart(Tournament tournament, TournamentRound round) {
        ZonedDateTime scheduleTime = round.getStartDate().plusSeconds(startDelaySeconds);
        logger.info("Scheduling start of round {} for tournament {} at {}.", round.getId(), tournament.getId(), scheduleTime);
        threadPoolTaskScheduler.schedule(() -> {
            logger.info("Attempting to start round {} for tournament {}.", round.getId(), tournament.getId());
            startRound(tournament.getId(), round.getId());
            logger.info("Completed starting round {} for tournament {}.", round.getId(), tournament.getId());
        }, scheduleTime.toInstant());
    }

    private void scheduleTournamentStart(Tournament tournament) {
        TournamentRound firstRound = tournament.getLevels().get(0).getRounds().get(0);
        scheduleRoundStart(tournament, firstRound);
    }

    private void saveTournamentVoters(Integer tournamentId, List<TournamentVoter> voters) {
        // Build maps
        Map<String, TournamentVoter> oldVoters = new HashMap<>();
        getVotersForTournament(tournamentId).forEach(voter -> oldVoters.put(voter.getEmail(), voter));
        Map<String, TournamentVoter> newVoters = new HashMap<>();
        voters.forEach(voter -> newVoters.put(voter.getEmail(), voter));

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

    private void saveRoundDescriptions(Integer tournamentId, String roundDescription, List<MatchDescription> matchDescriptions) {
        Tournament tournament = getTournament(tournamentId).orElse(null);
        if (tournament == null) {
            return;
        }
        getTournament(tournamentId)
                .flatMap(Tournament::getRoundByCurrentDate)
                .ifPresent(currentRound -> {
                    logger.info("Setting round descriptions on round {} of tournament {}", currentRound.getId(), tournament.getId());
                    List<TournamentMatch> matches = currentRound.getMatches();
                    if (matches.size() != matchDescriptions.size()) {
                        logger.warn("Failing to set round descriptions, round length did not match: {} matches and {} matches",
                                matches.size(), matchDescriptions.size());
                        return;
                    }
                    for (int i = 0; i < matches.size(); i++) {
                        TournamentMatch match = matches.get(i);
                        MatchDescription matchDescription = matchDescriptions.get(i);
                        if (!match.getSong1Title().equals(matchDescription.getSong1Title())) {
                            logger.warn("Failing to set round descriptions, song titles did not match: \"{}\" and \"{}\"",
                                    match.getSong1Title(), matchDescription.getSong1Title());
                            return;
                        }

                        if (!match.getSong2Title().equals(matchDescription.getSong2Title())) {
                            logger.warn("Failing to set round descriptions, song titles did not match: \"{}\" and \"{}\"",
                                    match.getSong2Title(), matchDescription.getSong2Title());
                            return;
                        }
                        match.setSong1Description(matchDescription.getSong1Description());
                        match.setSong2Description(matchDescription.getSong2Description());
                    }
                    currentRound.setDescription(roundDescription);
                    logger.info("Saving round descriptions on round {} of tournament {}", currentRound.getId(), tournamentId);
                    tournamentRepository.save(tournament);
                });
    }

    private void saveRoundDates(Integer tournamentId, List<RoundDate> roundDates) {
        Tournament tournament = getTournament(tournamentId).orElse(null);
        if (tournament == null) {
            return;
        }
        List<TournamentRound> rounds = getTournament(tournamentId)
                .map(Tournament::getLevels)
                .orElse(List.of())
                .stream()
                .flatMap(level -> level.getRounds().stream())
                .toList();
        // Check that length matches
        if(rounds.size() != roundDates.size()) {
            logger.warn("Failing to set round dates, rounds length did not match: {} rounds and {} rounds",
                    rounds.size(), roundDates.size());
            return;
        }
        for (int i = 0; i < rounds.size(); i++) {
            TournamentRound round = rounds.get(i);
            RoundDate roundDate = roundDates.get(i);
            round.setStartDate(roundDate.getStartDate());
            round.setEndDate(roundDate.getEndDate());
        }
        logger.info("Saving round dates for tournament {}", tournamentId);
        tournamentRepository.save(tournament);
    }
}
