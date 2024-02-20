package tournament.model;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter @NoArgsConstructor @ToString
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Integer matchesPerRound;
    private String spotifyPlaylist;

    @Enumerated(EnumType.STRING)
    private TournamentPrivacy privacy;
    @Enumerated(EnumType.STRING)
    private TournamentMode mode;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "tournament_id", nullable = false)
    @OrderBy("id ASC")
    private List<TournamentLevel> levels;

    private Integer creatorId;
    private Integer backgroundImageId;

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
        getCurrentOrNextRound().ifPresent(round -> {
            if (round.getStatus() == RoundStatus.CREATED) {
                summary.setVotingStartDate(round.getStartDate());
            } else if (round.getStatus() == RoundStatus.ACTIVE) {
                summary.setVotingEndDate(round.getEndDate());
            }
        });
        getActiveRound().ifPresent(activeRound ->
            summary.setVotingEndDate(activeRound.getEndDate())
        );
        summary.setSpotifyPlaylist(spotifyPlaylist);
        return summary;
    }

    @Transient
    @JsonIgnore
    public Optional<TournamentRound> getActiveRound() {
        return levels.stream()
                .flatMap(level -> level.getRounds().stream())
                .filter(round -> round.getStatus() == RoundStatus.ACTIVE)
                .findFirst();
    }

    @Transient
    @JsonIgnore
    public Optional<TournamentRound> getRoundByCurrentDate() {
        ZonedDateTime now = ZonedDateTime.now();
        return levels.stream()
                .flatMap(level -> level.getRounds().stream())
                .filter(round -> round.isDateInRange(now))
                .findFirst();
    }

    @Transient
    @JsonIgnore
    public Optional<TournamentRound> getVotableRound() {
        ZonedDateTime now = ZonedDateTime.now();
        return levels.stream()
                .flatMap(level -> level.getRounds().stream())
                .filter(round -> round.getStatus() == RoundStatus.ACTIVE && (mode == TournamentMode.INSTANT || round.isDateInRange(now)))
                .findFirst();
    }

    @Transient
    @JsonIgnore
    public Optional<TournamentRound> getRound(Integer roundId) {
        return levels.stream()
                .flatMap(level -> level.getRounds().stream())
                .filter(round -> round.getId().equals(roundId))
                .findFirst();
    }

    @Transient
    @JsonIgnore
    public ZonedDateTime getStartDate() {
        TournamentRound firstRound = levels.get(0).getRounds().get(0);
        return firstRound.getStartDate();
    }

    @Transient
    @JsonIgnore
    public Optional<TournamentRound> getCurrentOrNextRound() {
        if (mode == TournamentMode.SCHEDULED) {
            ZonedDateTime now = ZonedDateTime.now();
            return levels.stream()
                    .flatMap(level -> level.getRounds().stream())
                    .filter(round -> round.getEndDate().isAfter(now))
                    .findFirst();
        } else {
            return levels.stream()
                    .flatMap(level -> level.getRounds().stream())
                    .filter(round -> round.getStatus() != RoundStatus.RESOLVED)
                    .findFirst();
        }
    }

    @Transient
    @JsonIgnore
    public Optional<TournamentRound> getRoundAfter(TournamentRound round) {
        List<TournamentRound> rounds = levels.stream()
                .flatMap(level -> level.getRounds().stream())
                .toList();
        for (int i = 0; i < rounds.size() - 1; i++) {
            if (rounds.get(i).getId().equals(round.getId())) {
                return Optional.of(rounds.get(i + 1));
            }
        }
        return Optional.empty();
    }
}
