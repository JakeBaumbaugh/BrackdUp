package tournament.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class TournamentMatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "song_1")
    private Song song1;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "song_2")
    private Song song2;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "song_winner")
    private Song songWinner;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy="match", cascade = CascadeType.ALL)
    @OrderBy("timestamp ASC")
    private List<Vote> votes;

    @ToString.Include(name = "song1")
    @Transient
    @JsonIgnore
    public String getSong1Title() {
        return song1 != null ? song1.getTitle() : null;
    }

    @ToString.Include(name = "song2")
    @Transient
    @JsonIgnore
    public String getSong2Title() {
        return song2 != null ? song2.getTitle() : null;
    }

    @ToString.Include(name = "songWinner")
    @Transient
    @JsonIgnore
    public String getSongWinnerTitle() {
        return songWinner != null ? songWinner.getTitle() : null;
    }

    @Transient
    @JsonIgnore
    public void decideWinner(List<Vote> votes) {
        List<Vote> song1Votes = new ArrayList<>();
        List<Vote> song2Votes = new ArrayList<>();
        votes.forEach(vote -> {
            if (song1 != null && song1.equals(vote.getSong())) {
                song1Votes.add(vote);
            } else if (song2 != null && song2.equals(vote.getSong())) {
                song2Votes.add(vote);
            }
        });
        
        Song winner;
        if (song1Votes.size() > song2Votes.size()) {
            winner = song1;
        } else if (song2Votes.size() > song1Votes.size()) {
            winner = song2;
        } else {
            winner = Math.random() > 0.5 ? song1 : song2;
        }
        songWinner = winner;
    }
}
