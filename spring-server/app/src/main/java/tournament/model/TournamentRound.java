package tournament.model;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class TournamentRound {
    @Id
    @GeneratedValue
    private Integer id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @OneToMany
    @JoinColumn(name = "round_id")
    @OrderBy("id ASC")
    private List<TournamentMatch> matches;

    public ZonedDateTime getStartDate() {
        return startDate.atZone(ZoneId.of("America/New_York"));
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate.withZoneSameInstant(ZoneId.of("America/New_York")).toLocalDateTime();
    }

    public ZonedDateTime getEndDate() {
        return endDate.atZone(ZoneId.of("America/New_York"));
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = endDate.withZoneSameInstant(ZoneId.of("America/New_York")).toLocalDateTime();
    }

    public boolean validSongVotes(List<Song> songs) {
        // O(songs x matches), maybe could be better
        Set<TournamentMatch> votedMatches = songs.stream()
                .map(song -> matches.stream()
                        .filter(match -> match.getSong1().getId().equals(song.getId()) || match.getSong2().getId().equals(song.getId()))
                        .findFirst()
                        .orElse(null)
                )
                .collect(Collectors.toSet());
        return !votedMatches.contains(null) && votedMatches.size() == songs.size();
    }
}
