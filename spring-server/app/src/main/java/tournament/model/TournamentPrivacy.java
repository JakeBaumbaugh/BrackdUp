package tournament.model;

public enum TournamentPrivacy {
    PRIVATE, // Viewable and votable by whitelist
    VISIBLE, // Viewable by any, votable by whitelist
    PUBLIC; // Viewable and votable by any
}
