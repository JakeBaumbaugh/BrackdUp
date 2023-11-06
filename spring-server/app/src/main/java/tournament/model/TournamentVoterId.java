package tournament.model;

import lombok.*;

@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class TournamentVoterId {
    private Integer tournamentId;
    private String email;

    public TournamentVoterId(Integer tournamentId, String email) {
        this.tournamentId = tournamentId;
        this.email = email.toLowerCase();
    }

    public void setEmail(String email) {
        this.email = email.toLowerCase();
    }
}
