package tournament.model;

import java.util.List;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class TournamentBuilder {
    private String name;
    private int songCount;
    private int matchesPerRound;
    private String spotifyPlaylist;
    private List<Song> songs;
    private List<TournamentLevel> levels;
    private TournamentPrivacy privacy;
}
