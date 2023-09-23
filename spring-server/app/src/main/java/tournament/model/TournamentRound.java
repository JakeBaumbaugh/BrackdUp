package tournament.model;

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
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;

    @OneToMany
    @JoinColumn(name = "round_id")
    @OrderBy("id ASC")
    private List<TournamentMatch> matches;
}
