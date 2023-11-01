package tournament.model;

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

@Entity @IdClass(TournamentVoterId.class)
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class TournamentVoter {
    @Id
    private Integer tournamentId;

    @Id
    private String email;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;
}
