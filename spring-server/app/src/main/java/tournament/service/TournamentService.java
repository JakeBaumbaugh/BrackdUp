package tournament.service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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
import tournament.model.Profile;
import tournament.model.RoundStatus;
import tournament.model.Song;
import tournament.model.Tournament;
import tournament.model.TournamentLevel;
import tournament.model.TournamentMatch;
import tournament.model.TournamentRound;
import tournament.model.TournamentSummary;
import tournament.model.Vote;
import tournament.model.VoteId;
import tournament.repository.SongRepository;
import tournament.repository.TournamentRepository;
import tournament.repository.VoteRepository;

@Service
public class TournamentService {
    private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);

    @Value("${resolve.delay.seconds:15}")
    private Integer resolveDelaySeconds;
    
    private TournamentRepository tournamentRepository;
    private SongRepository songRepository;
    private VoteRepository voteRepository;
    private ThreadPoolTaskScheduler threadPoolTaskScheduler;

    @Autowired
    public TournamentService(TournamentRepository tournamentRepository,
                             SongRepository songRepository,
                             VoteRepository voteRepository,
                             ThreadPoolTaskScheduler threadPoolTaskScheduler) {
        this.tournamentRepository = tournamentRepository;
        this.songRepository = songRepository;
        this.voteRepository = voteRepository;
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

    public List<Song> getSongs(List<Integer> songIds) {
        return songRepository.findAllById(songIds);
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
        List<VoteId> voteIds = round.getMatches()
                .stream()
                .map(match -> new VoteId(profile, match))
                .toList();
        List<Vote> oldVotes = voteRepository.findAllById(voteIds);

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

        voteRepository.saveAll(votes);
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

    public Tournament generateTournament(String name) {
        int songCount = 8;
        int levelCount = (int) Math.round(Math.log(songCount) / Math.log(2));

        // Build tournament
        Tournament tournament = new Tournament();
        tournament.setName(name);
        tournament.setMatchesPerRound(2);
        tournament.setLevels(new ArrayList<>());

        // Build levels
        ZonedDateTime startDate = ZonedDateTime.now();
        for(int levelIndex = 0; levelIndex < levelCount; levelIndex++) {
            TournamentLevel level = new TournamentLevel();
            level.setName("Level " + (levelIndex+1));
            // Build rounds
            int songCountInLevel = songCount / (int) Math.pow(2, levelIndex);
            int matchCountInLevel = songCountInLevel/2;
            int roundCount = (int) Math.ceil((double) matchCountInLevel / tournament.getMatchesPerRound());
            List<TournamentRound> rounds = new ArrayList<>();
            for(int roundIndex = 0; roundIndex < roundCount; roundIndex++) {
                TournamentRound round = new TournamentRound();
                round.setStartDate(startDate);
                startDate = startDate.plusMinutes(1);
                round.setEndDate(startDate);
                rounds.add(round);
            }
            logger.debug("Generated {} rounds for level index {}", rounds.size(), levelIndex);
            level.setRounds(rounds);
            tournament.getLevels().add(level);
        }

        // Select songs and build matches
        List<Song> songs = songRepository.findAll();
        Collections.shuffle(songs);
        songs = songs.subList(0, songCount);
        logger.debug("Selected songs for tournament: {}", songs);
        List<TournamentMatch> matches = new ArrayList<>();
        for(int i = 0; i < songs.size(); i+=2) {
            TournamentMatch match = new TournamentMatch();
            match.setSong1(songs.get(i));
            match.setSong2(songs.get(i+1));
            matches.add(match);
        }
        logger.debug("Created {} matches for the initial level of voting.", matches.size());

        // Populate initial level
        TournamentLevel firstLevel = tournament.getLevels().get(0);
        for(int matchIndex = 0; matchIndex < matches.size(); matchIndex++) {
            TournamentRound round = firstLevel.getRounds().get(matchIndex / tournament.getMatchesPerRound());
            List<TournamentMatch> roundMatches = round.getMatches() == null ? new ArrayList<>() : round.getMatches();
            roundMatches.add(matches.get(matchIndex));
            round.setMatches(roundMatches);
        }
        firstLevel.getRounds().get(0).setStatus(RoundStatus.ACTIVE);

        tournament = tournamentRepository.save(tournament);
        logger.debug("Created tournament: {}", tournament);
        scheduleRoundResolve(tournament, tournament.getLevels().get(0).getRounds().get(0));
        return tournament;
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
