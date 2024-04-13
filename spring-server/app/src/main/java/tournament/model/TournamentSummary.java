package tournament.model;

import java.time.ZonedDateTime;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class TournamentSummary {
    private Integer id;
    private String name;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private Entry entryWinner;
    private ZonedDateTime votingStartDate;
    private ZonedDateTime votingEndDate;
    private String spotifyPlaylist;
}
