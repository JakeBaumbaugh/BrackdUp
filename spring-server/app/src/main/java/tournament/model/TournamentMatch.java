package tournament.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "song_1_vote_count")
    private Integer song1VoteCount;
    
    @Column(name = "song_2_vote_count")
    private Integer song2VoteCount;

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
}
