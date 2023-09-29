package tournament.model;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

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
}
