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
    private int entryCount;
    private int matchesPerRound;
    private TournamentType type;
    private String spotifyPlaylist;
    private List<Entry> entries;
    private List<TournamentLevel> levels;
    private TournamentPrivacy privacy;
    private TournamentMode mode;
    private Profile creator;
    private Integer backgroundImage;
}
