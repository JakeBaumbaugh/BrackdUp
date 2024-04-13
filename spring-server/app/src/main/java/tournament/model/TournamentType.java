package tournament.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class TournamentType {
    @Id
    private String type;
    @Column(name = "line_1_label")
    private String line1Label;
    @Column(name = "line_2_label")
    private String line2Label;
    @Column(name = "line_2")
    private boolean line2;
    private boolean spotify;
    private boolean youtube;
}
