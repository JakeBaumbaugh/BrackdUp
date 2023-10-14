package tournament.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tournament.model.Profile;
import tournament.model.Song;
import tournament.model.Tournament;
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
    
    private TournamentRepository tournamentRepository;
    private SongRepository songRepository;
    private VoteRepository voteRepository;

    @Autowired
    public TournamentService(TournamentRepository tournamentRepository, SongRepository songRepository, VoteRepository voteRepository) {
        this.tournamentRepository = tournamentRepository;
        this.songRepository = songRepository;
        this.voteRepository = voteRepository;
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
}
