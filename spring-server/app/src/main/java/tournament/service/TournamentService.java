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

import jakarta.transaction.Transactional;
import tournament.model.Entry;
import tournament.model.Profile;
import tournament.model.RoundStatus;
import tournament.model.Tournament;
import tournament.model.TournamentBuilder;
import tournament.model.TournamentLevel;
import tournament.model.TournamentMatch;
import tournament.model.TournamentMode;
import tournament.model.TournamentPrivacy;
import tournament.model.TournamentRound;
import tournament.model.TournamentSettings;
import tournament.model.TournamentSettings.MatchDescription;
import tournament.model.TournamentSettings.RoundDate;
import tournament.model.TournamentSummary;
import tournament.model.TournamentVoter;
import tournament.model.Vote;
import tournament.model.VoteId;
import tournament.repository.EntryRepository;
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
    private EntryRepository entryRepository;
    private TournamentVoterRepository tournamentVoterRepository;
    private TournamentFactory tournamentFactory;
    private ThreadPoolTaskScheduler threadPoolTaskScheduler;

    @Autowired
    public TournamentService(ProfileService profileService,
                             VoteService voteService,
                             TournamentRepository tournamentRepository,
                             EntryRepository entryRepository,
                             TournamentVoterRepository tournamentVoterRepository,
                             TournamentFactory tournamentFactory,
                             ThreadPoolTaskScheduler threadPoolTaskScheduler) {
        this.profileService = profileService;
        this.voteService = voteService;
        this.tournamentRepository = tournamentRepository;
        this.entryRepository = entryRepository;
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
                    if (tournament.getMode() == TournamentMode.SCHEDULED) {
                        tournament.getVotableRound()
                                .ifPresent(round -> {
                                    logger.info("Scheduling initial resolve for round {} in tournament {}.", round.getId(), tournament.getId());
                                    scheduleRoundResolve(tournament, round);
                                });
                        TournamentRound firstRound = tournament.getLevels().get(0).getRounds().get(0);
                        if (tournament.getStartDate().isAfter(now) || firstRound.getStatus() == RoundStatus.CREATED) {
                            scheduleTournamentStart(tournament);
                        }
                    }
                });
    }

    public Optional<Tournament> getTournament(Integer id) {
        return tournamentRepository.findById(id);
    }

    public Optional<Tournament> getTournament(String name) {
        return tournamentRepository.findByName(name);
    }

    public List<TournamentSummary> getTournaments(Profile profile) {
        return tournamentRepository.findAll()
            .stream()
            .filter(tournament -> profileService.profileCanView(profile, tournament.getId()))
            .map(Tournament::getTournamentSummary)
            .toList();
    }

    @Transactional
    public void deleteTournament(Integer id) {
        tournamentVoterRepository.deleteByTournamentId(id);
        tournamentRepository.deleteById(id);
    }

    public void createTournament(TournamentBuilder builder) {
        // Build tournament
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

    public List<Entry> getEntries(List<Integer> entryIds) {
        return entryRepository.findAllById(entryIds);
    }

    public List<Integer> getVotedEntryIds(Profile profile, TournamentRound round) {
        List<VoteId> voteIds = round.getMatches()
                .stream()
                .map(match -> new VoteId(profile, match))
                .toList();
        List<Vote> votes = voteService.findAllById(voteIds);
        return votes.stream()
                .map(vote -> vote.getEntry().getId())
                .toList();
    }

    /**
     * Saves the user profile's submitted votes. Also resolves the round
     * if it was the final voter for the round on an instant tournament
     * @param profile       The user profile that submitted the votes
     * @param round         The round containing the matches being voted on
     * @param entries       The entries which the user voted for
     * @param tournament    The tournament containing the matches being voted on
     * @return              Whether the round ended as a result of the vote
     */
    public boolean vote(Profile profile, TournamentRound round, List<Entry> entries, Tournament tournament) {
        voteService.submitVotes(profile, round, entries);
        // Resolve round if necessary
        if (tournament.getMode() == TournamentMode.INSTANT) {
            boolean allVoted = getVotersForTournament(tournament)
                    .stream()
                    .allMatch(TournamentVoter::getFullVoted);
            if (allVoted) {
                resolveRound(tournament.getId(), round.getId());
                return true;
            }
        }
        return false;
    }

    /**
     * Saves the user profile's submitted votes. Also resolves the round
     * if it was the final voter for the round on an instant tournament
     * @param profile       The user profile that submitted the votes
     * @param round         The round containing the matches being voted on
     * @param entryId       The id of the entry the user voted for
     * @param tournament    The tournament containing the matches being voted on
     * @return              Whether the round ended as a result of the vote
     */
    public boolean vote(Profile profile, TournamentRound round, Integer entryId, Tournament tournament) {
        Entry entry = getEntries(List.of(entryId)).get(0);
        voteService.submitVote(profile, round, entry);
        // Resolve round if necessary
        if (tournament.getMode() == TournamentMode.INSTANT) {
            boolean allVoted = getVotersForTournament(tournament)
                    .stream()
                    .allMatch(TournamentVoter::getFullVoted);
            if (allVoted) {
                resolveRound(tournament.getId(), round.getId());
                return true;
            }
        }
        return false;
    }

    public void removeVote(Profile profile, TournamentRound round, Integer entryId) {
        Entry entry = getEntries(List.of(entryId)).get(0);
        voteService.removeVote(profile, round, entry);
    }

    public List<TournamentVoter> getVotersForTournament(Integer tournamentId) {
        return getTournament(tournamentId)
                .map(this::getVotersForTournament)
                .orElse(List.of());
    }

    public List<TournamentVoter> getVotersForTournament(Tournament tournament) {
        List<TournamentVoter> voters = tournamentVoterRepository.findAllByTournamentId(tournament.getId());
        // Check if voters have voted for the current votable round
        tournament.getVotableRound().ifPresent(round -> {
            int matchCount = round.getMatches().size();
            voters.forEach(voter -> {
                Profile profile = voter.getProfile();
                if (profile != null) {
                    List<Vote> votes = voteService.findByRound(round, profile);
                    // Any votes submitted
                    voter.setHasVoted(!votes.isEmpty());
                    // Votes submitted for all matches
                    voter.setFullVoted(votes.size() == matchCount);
                } else {
                    voter.setHasVoted(false);
                    voter.setFullVoted(false);
                }
            });
        });
        return voters;
    }

    public TournamentSettings getTournamentSettings(Integer tournamentId) {
        List<TournamentVoter> voters = getVotersForTournament(tournamentId);
        Optional<Tournament> optionalTournament = getTournament(tournamentId);
        Optional<TournamentRound> currentRound = optionalTournament
                .map(tournament -> tournament.getRoundByCurrentDate().orElse(null));
        TournamentMode mode = optionalTournament
                .map(Tournament::getMode)
                .orElse(null);
        String roundDescription = currentRound
                .map(TournamentRound::getDescription)
                .orElse(null);
        List<MatchDescription> matchDescriptions = currentRound
                .map(round -> round.getMatches()
                        .stream()
                        .map(match -> new MatchDescription(match.getEntry1Line1(), match.getEntry1Description(), match.getEntry2Line1(), match.getEntry2Description()))
                        .toList()
                )
                .orElse(null);
        List<RoundDate> roundDates;
        if (mode == TournamentMode.INSTANT) {
            roundDates = null;
        } else {
            roundDates = optionalTournament
                    .map(Tournament::getLevels)
                    .orElse(List.of())
                    .stream()
                    .flatMap(level -> level.getRounds().stream())
                    .map(RoundDate::new)
                    .toList();
        }
        TournamentPrivacy privacy = optionalTournament
                .map(Tournament::getPrivacy)
                .orElse(null);
        
        return new TournamentSettings(tournamentId, voters, roundDescription, matchDescriptions, roundDates, privacy);
    }

    public void saveTournamentSettings(TournamentSettings settings) {
        Integer tournamentId = settings.getTournamentId();
        if (tournamentId == null) {
            return;
        }
        saveTournamentVoters(tournamentId, settings.getVoters());
        saveRoundDescriptions(tournamentId, settings.getCurrentRoundDescription(), settings.getMatchDescriptions());
        saveRoundDates(tournamentId, settings.getRoundDates());
        saveTournamentPrivacy(tournamentId, settings.getPrivacy());
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
                match.setEntry1(round.getMatches().get(matchIndex).getEntryWinner());
                match.setEntry2(round.getMatches().get(matchIndex+1).getEntryWinner());
                newMatches.add(match);
                logger.debug("\"{}\" vs. \"{}\"", match.getEntry1().getLine1(), match.getEntry2().getLine1());
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
        tournament.getRoundAfter(round).ifPresent(nextRound -> scheduleRoundStart(finalTournament, nextRound));
    }

    private void scheduleRoundResolve(Tournament tournament, TournamentRound round) {
        if (tournament.getMode() == TournamentMode.INSTANT) {
            // Nothing to schedule
            logger.info("Skipping scheduling resolution of round {} for instant tournament {}.", round.getId(), tournament.getId());
        } else {
            ZonedDateTime scheduleTime = round.getEndDate().plusSeconds(resolveDelaySeconds);
            logger.info("Scheduling resolution of round {} for tournament {} at {}.", round.getId(), tournament.getId(), scheduleTime);
            threadPoolTaskScheduler.schedule(() -> {
                logger.info("Attempting to resolve round {} for tournament {}.", round.getId(), tournament.getId());
                resolveRound(tournament.getId(), round.getId());
                logger.info("Completed resolving round {} for tournament {}.", round.getId(), tournament.getId());
            }, scheduleTime.toInstant());
        }
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
        if (tournament.getMode() == TournamentMode.INSTANT) {
            // Start round immediately
            logger.info("Starting round {} for tournament {}.", round.getId(), tournament.getId());
            startRound(tournament.getId(), round.getId());
        } else {
            // Schedule start of round
            ZonedDateTime scheduleTime = round.getStartDate().plusSeconds(startDelaySeconds);
            logger.info("Scheduling start of round {} for tournament {} at {}.", round.getId(), tournament.getId(), scheduleTime);
            threadPoolTaskScheduler.schedule(() -> {
                logger.info("Attempting to start round {} for tournament {}.", round.getId(), tournament.getId());
                startRound(tournament.getId(), round.getId());
                logger.info("Completed starting round {} for tournament {}.", round.getId(), tournament.getId());
            }, scheduleTime.toInstant());
        }
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
                        if (!match.getEntry1Line1().equals(matchDescription.getEntry1Line1())) {
                            logger.warn("Failing to set round descriptions, entry line1s did not match: \"{}\" and \"{}\"",
                                    match.getEntry1Line1(), matchDescription.getEntry1Line1());
                            return;
                        }

                        if (!match.getEntry2Line1().equals(matchDescription.getEntry2Line1())) {
                            logger.warn("Failing to set round descriptions, entry line1s did not match: \"{}\" and \"{}\"",
                                    match.getEntry1Line1(), matchDescription.getEntry2Line1());
                            return;
                        }
                        match.setEntry1Description(matchDescription.getEntry1Description());
                        match.setEntry2Description(matchDescription.getEntry2Description());
                    }
                    currentRound.setDescription(roundDescription);
                    logger.info("Saving round descriptions on round {} of tournament {}", currentRound.getId(), tournamentId);
                    tournamentRepository.save(tournament);
                });
    }

    private void saveRoundDates(Integer tournamentId, List<RoundDate> roundDates) {
        Tournament tournament = getTournament(tournamentId).orElse(null);
        if (tournament == null || roundDates == null) {
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

    private void saveTournamentPrivacy(Integer tournamentId, TournamentPrivacy privacy) {
        getTournament(tournamentId).ifPresent(tournament -> {
            tournament.setPrivacy(privacy);
            logger.info("Saving tournament privacy {} for tournament {}", privacy, tournamentId);
            tournamentRepository.save(tournament);
        });
    }
}
