package tournament.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString @EqualsAndHashCode
public class TournamentSettings {
    Integer tournamentId;
    List<TournamentVoter> voters;

    public boolean hasVoter(String email) {
        return voters.stream().anyMatch(voter -> voter.getEmail().equals(email));
    }
}
