package tournament.model;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
import lombok.Setter;
import lombok.ToString;
import tournament.util.DateUtil;

@Entity
@Getter @Setter @ToString
public class TournamentRound {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    @Enumerated(EnumType.STRING)
    private RoundStatus status;

    @ToString.Exclude
    private String description;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "round_id", nullable = false)
    @OrderBy("id ASC")
    private List<TournamentMatch> matches;

    public TournamentRound() {
        status = RoundStatus.CREATED;
    }

    public ZonedDateTime getStartDate() {
        return DateUtil.localToZoned(startDate);
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = DateUtil.zonedToLocal(startDate);
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public ZonedDateTime getEndDate() {
        return DateUtil.localToZoned(endDate);
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = DateUtil.zonedToLocal(endDate);
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getDescription() {
        return description != null ? description : "";
    }

    public void addMatch(TournamentMatch match) {
        if (matches == null) {
            matches = new ArrayList<>(1);
        }
        matches.add(match);
    }

    public boolean validSongVotes(List<Song> songs) {
        // O(songs x matches), maybe could be better
        Set<TournamentMatch> votedMatches = songs.stream()
                .map(song -> matches.stream()
                        .filter(match -> match.getSong1().getId().equals(song.getId()) || match.getSong2().getId().equals(song.getId()))
                        .findFirst()
                        .orElse(null)
                )
                .collect(Collectors.toSet());
        return !votedMatches.contains(null) && votedMatches.size() == songs.size();
    }

    @Transient
    @JsonIgnore
    public boolean isDateInRange(ZonedDateTime zdt) {
        LocalDateTime ldt = DateUtil.zonedToLocal(zdt);
        if(startDate == null || endDate == null) {
            return false;
        }
        return startDate.isBefore(ldt) && endDate.isAfter(ldt);
    }
}
