package tournament.model;

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
public class TournamentLevel {
    @Id
    @GeneratedValue
    private Integer id;
    private String name;

    @OneToMany
    @JoinColumn(name = "level_id")
    @OrderBy("id ASC")
    private List<TournamentRound> rounds;
}
