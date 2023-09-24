package tournament.model;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Transient;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class Tournament {
    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private Integer matchesPerRound;

    @OneToMany
    @JoinColumn(name = "tournament_id")
    @OrderBy("id ASC")
    private List<TournamentLevel> levels;

    @Transient
    @JsonIgnore
    public TournamentSummary getTournamentSummary() {
        TournamentSummary summary = new TournamentSummary();
        summary.setId(id);
        summary.setName(name);
        TournamentLevel firstLevel = levels.get(0);
        TournamentLevel lastLevel = levels.get(levels.size() - 1);
        TournamentRound firstRound = firstLevel.getRounds().get(0);
        TournamentRound lastRound = lastLevel.getRounds().get(lastLevel.getRounds().size() - 1);
        summary.setStartDate(firstRound.getStartDate());
        if(lastRound.getMatches().size() == 1) {
            summary.setEndDate(lastRound.getEndDate());
            TournamentMatch finalMatch = lastRound.getMatches().get(0);
            summary.setSongWinner(finalMatch.getSongWinner());
        }
        getCurrentRound().ifPresent(currentRound ->
            summary.setVotingEndDate(currentRound.getEndDate())
        );
        return summary;
    }

    @Transient
    @JsonIgnore
    public Optional<TournamentRound> getCurrentRound() {
        return levels
            .stream()
            .flatMap(level -> level.getRounds().stream())
            .filter(round -> {
                ZonedDateTime now = ZonedDateTime.now(ZoneId.of("America/New_York"));
                if(round.getStartDate() == null || round.getEndDate() == null) {
                    return false;
                }
                return round.getStartDate().isBefore(now) && round.getEndDate().isAfter(now);
            })
            .findFirst();
    }
}
