package tournament.model;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @IdClass(VoteId.class)
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class Vote {
    @Id
    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @Id
    @ManyToOne
    @JoinColumn(name = "match_id")
    private TournamentMatch match;

    @ManyToOne
    @JoinColumn(name = "entry_id")
    private Entry entry;

    private LocalDateTime timestamp;

    public ZonedDateTime getTimestamp() {
        return timestamp.atZone(ZoneId.of("America/New_York"));
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp.withZoneSameInstant(ZoneId.of("America/New_York")).toLocalDateTime();
    }

    public void setTimestamp() {
        this.timestamp = ZonedDateTime.now(ZoneId.of("America/New_York")).toLocalDateTime();
    }
}