package tournament.model;

import java.io.Serializable;
import java.time.LocalDateTime;

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

@Entity @IdClass(VoteId.class)
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class Vote {
    @Id
    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @Id
    @ManyToOne
    @JoinColumn(name = "match_id")
    private TournamentMatch match;

    @ManyToOne
    @JoinColumn(name = "song_id")
    private Song song;

    private LocalDateTime timestamp;
}

@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
class VoteId implements Serializable {
    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "match_id")
    private TournamentMatch match;
}