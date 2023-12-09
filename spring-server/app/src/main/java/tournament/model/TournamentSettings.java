package tournament.model;

import java.time.ZonedDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString @EqualsAndHashCode
public class TournamentSettings {
    private Integer tournamentId;
    private List<TournamentVoter> voters;
    private String currentRoundDescription;
    private List<MatchDescription> matchDescriptions;
    private List<RoundDate> roundDates;

    public boolean hasVoter(String email) {
        return voters.stream().anyMatch(voter -> voter.getEmail().equals(email));
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString @EqualsAndHashCode
    public static class MatchDescription {
        private String song1Title;
        private String song1Description;
        private String song2Title;
        private String song2Description;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString @EqualsAndHashCode
    public static class RoundDate {
        private ZonedDateTime startDate;
        private ZonedDateTime endDate;

        public RoundDate(TournamentRound round) {
            this.startDate = round.getStartDate();
            this.endDate = round.getEndDate();
        }
    }
}
