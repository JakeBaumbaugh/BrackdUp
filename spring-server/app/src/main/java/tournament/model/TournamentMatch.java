package tournament.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @ToString
public class TournamentMatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "entry_1")
    private Entry entry1;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "entry_2")
    private Entry entry2;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "entry_winner")
    private Entry entryWinner;

    @Column(name = "entry_1_vote_count")
    private Integer entry1VoteCount;
    
    @Column(name = "entry_2_vote_count")
    private Integer entry2VoteCount;

    @ToString.Exclude
    @Column(name = "entry_1_description")
    private String entry1Description;
    @ToString.Exclude
    @Column(name = "entry_2_description")
    private String entry2Description;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy="match", cascade = CascadeType.ALL)
    @OrderBy("timestamp ASC")
    private List<Vote> votes;

    @ToString.Include(name = "entry1")
    @Transient
    @JsonIgnore
    public String getEntry1Line1() {
        return entry1 != null ? entry1.getLine1() : null;
    }

    @ToString.Include(name = "entry2")
    @Transient
    @JsonIgnore
    public String getEntry2Line1() {
        return entry2 != null ? entry2.getLine1() : null;
    }

    @ToString.Include(name = "entryWinner")
    @Transient
    @JsonIgnore
    public String getEntryWinnerLine1() {
        return entryWinner != null ? entryWinner.getLine1() : null;
    }

    public String getEntry1Description() {
        return entry1Description != null ? entry1Description : "";
    }

    public String getEntry2Description() {
        return entry2Description != null ? entry2Description : "";
    }
}
