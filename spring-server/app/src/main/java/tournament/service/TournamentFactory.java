package tournament.service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tournament.model.Entry;
import tournament.model.RoundStatus;
import tournament.model.Tournament;
import tournament.model.TournamentBuilder;
import tournament.model.TournamentLevel;
import tournament.model.TournamentMatch;
import tournament.model.TournamentMode;
import tournament.model.TournamentPrivacy;
import tournament.model.TournamentRound;
import tournament.repository.TournamentRepository;

@Component
public class TournamentFactory {
    private static final Logger logger = LoggerFactory.getLogger(TournamentFactory.class);

    private EntryService entryService;
    private TournamentRepository tournamentRepository;
    private TournamentTypeService tournamentTypeService;

    @Autowired
    public TournamentFactory(EntryService entryService, TournamentRepository tournamentRepository, TournamentTypeService tournamentTypeService) {
        this.entryService = entryService;
        this.tournamentRepository = tournamentRepository;
        this.tournamentTypeService = tournamentTypeService;
    }

    public Tournament buildTournament(TournamentBuilder builder) {
        List<Entry> entries = builder.getEntries();
        List<TournamentLevel> levels = builder.getLevels();
        String builderType = builder.getType().getType();
        String type = tournamentTypeService.validateType(builderType).getType();

        // Prepare new entries, marked with id -1
        entries.forEach(entry -> {
            if(entry.getId() == -1) {
                entry.setId(null);
                entry.setType(type);
            }
        });
        builder.getLevels().forEach(level -> {
            level.setId(null);
            level.getRounds().forEach(round -> round.setId(null));
        });

        // Clear dates for instant tournaments
        if (builder.getMode() == TournamentMode.INSTANT) {
            builder.getLevels()
                    .stream()
                    .map(TournamentLevel::getRounds)
                    .flatMap(Collection::stream)
                    .forEach(round -> {
                        round.setStartDate(null);
                        round.setEndDate(null);
                    });
        }

        entries = entryService.saveAll(entries);

        // Build first level matches
        TournamentLevel firstLevel = levels.get(0);
        for(int entryIndex = 0; entryIndex < entries.size(); entryIndex += 2) {
            TournamentMatch match = new TournamentMatch();
            match.setEntry1(entries.get(entryIndex));
            match.setEntry2(entries.get(entryIndex + 1));
            int matchIndex = entryIndex / 2;
            TournamentRound round = firstLevel.getRounds().get(matchIndex / builder.getMatchesPerRound());
            round.addMatch(match);
        }

        // Build tournament
        Tournament tournament = new Tournament();
        tournament.setName(builder.getName());
        tournament.setMatchesPerRound(builder.getMatchesPerRound());
        tournament.setType(type);
        tournament.setSpotifyPlaylist(builder.getSpotifyPlaylist());
        tournament.setLevels(levels);
        tournament.setPrivacy(builder.getPrivacy());
        tournament.setMode(builder.getMode());
        tournament.setCreatorId(builder.getCreator().getId());
        tournament.setBackgroundImageId(builder.getBackgroundImage());

        return tournament;
    }
    
    public Tournament buildDefaulTournament(String name) {
        int entryCount = 16;
        int levelCount = (int) Math.round(Math.log(entryCount) / Math.log(2));
        int matchesPerRound = 4;
        int roundLengthMinutes = 2;
        int roundDelayMinutes = 1;

        // Build tournament
        Tournament tournament = new Tournament();
        tournament.setName(name);
        tournament.setMatchesPerRound(matchesPerRound);
        tournament.setType(tournamentTypeService.validateType("SONG").getType());
        tournament.setPrivacy(TournamentPrivacy.VISIBLE);
        tournament.setMode(TournamentMode.SCHEDULED);
        tournament.setLevels(new ArrayList<>());

        // Build levels
        ZonedDateTime startDate = ZonedDateTime.now();
        for(int levelIndex = 0; levelIndex < levelCount; levelIndex++) {
            TournamentLevel level = new TournamentLevel();
            level.setName("Level " + (levelIndex+1));
            // Build rounds
            int entryCountInLevel = entryCount / (int) Math.pow(2, levelIndex);
            int matchCountInLevel = entryCountInLevel / 2;
            int roundCount = (int) Math.ceil((double) matchCountInLevel / tournament.getMatchesPerRound());
            List<TournamentRound> rounds = new ArrayList<>();
            for(int roundIndex = 0; roundIndex < roundCount; roundIndex++) {
                TournamentRound round = new TournamentRound();
                round.setStartDate(startDate);
                startDate = startDate.plusMinutes(roundLengthMinutes);
                round.setEndDate(startDate);
                startDate = startDate.plusMinutes(roundDelayMinutes);
                rounds.add(round);
            }
            logger.debug("Generated {} rounds for level index {}", rounds.size(), levelIndex);
            level.setRounds(rounds);
            tournament.getLevels().add(level);
        }

        // Select entries and build matches
        List<Entry> entries = entryService.findAll();
        Collections.shuffle(entries);
        entries = entries.subList(0, entryCount);
        logger.debug("Selected entries for tournament: {}", entries);
        List<TournamentMatch> matches = new ArrayList<>();
        for(int i = 0; i < entries.size(); i+=2) {
            TournamentMatch match = new TournamentMatch();
            match.setEntry1(entries.get(i));
            match.setEntry2(entries.get(i+1));
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
        return tournament;
    }
}
