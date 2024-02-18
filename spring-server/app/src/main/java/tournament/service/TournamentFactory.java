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

import tournament.model.RoundStatus;
import tournament.model.Song;
import tournament.model.Tournament;
import tournament.model.TournamentBuilder;
import tournament.model.TournamentLevel;
import tournament.model.TournamentMatch;
import tournament.model.TournamentMode;
import tournament.model.TournamentRound;
import tournament.repository.SongRepository;
import tournament.repository.TournamentRepository;

@Component
public class TournamentFactory {
    private static final Logger logger = LoggerFactory.getLogger(TournamentFactory.class);

    private SongRepository songRepository;
    private TournamentRepository tournamentRepository;

    @Autowired
    public TournamentFactory(SongRepository songRepository, TournamentRepository tournamentRepository) {
        this.songRepository = songRepository;
        this.tournamentRepository = tournamentRepository;
    }

    public Tournament buildTournament(TournamentBuilder builder) {
        List<Song> songs = builder.getSongs();
        List<TournamentLevel> levels = builder.getLevels();

        // Clear ids
        songs.forEach(song -> {
            if(song.getId() == -1) {
                song.setId(null);
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

        // Shuffle songs
        songs = songRepository.saveAll(songs);
        Collections.shuffle(songs);

        // Build first level matches
        TournamentLevel firstLevel = levels.get(0);
        for(int songIndex = 0; songIndex < songs.size(); songIndex += 2) {
            TournamentMatch match = new TournamentMatch();
            match.setSong1(songs.get(songIndex));
            match.setSong2(songs.get(songIndex + 1));
            int matchIndex = songIndex / 2;
            TournamentRound round = firstLevel.getRounds().get(matchIndex / builder.getMatchesPerRound());
            round.addMatch(match);
        }

        // Build tournament
        Tournament tournament = new Tournament();
        tournament.setName(builder.getName());
        tournament.setMatchesPerRound(builder.getMatchesPerRound());
        tournament.setSpotifyPlaylist(builder.getSpotifyPlaylist());
        tournament.setLevels(levels);
        tournament.setPrivacy(builder.getPrivacy());
        tournament.setMode(builder.getMode());
        tournament.setCreatorId(builder.getCreator().getId());

        return tournament;
    }
    
    public Tournament buildDefaulTournament(String name) {
        int songCount = 16;
        int levelCount = (int) Math.round(Math.log(songCount) / Math.log(2));
        int matchesPerRound = 4;
        int roundLengthMinutes = 2;
        int roundDelayMinutes = 1;

        // Build tournament
        Tournament tournament = new Tournament();
        tournament.setName(name);
        tournament.setMatchesPerRound(matchesPerRound);
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
                startDate = startDate.plusMinutes(roundLengthMinutes);
                round.setEndDate(startDate);
                startDate = startDate.plusMinutes(roundDelayMinutes);
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
        return tournament;
    }
}
