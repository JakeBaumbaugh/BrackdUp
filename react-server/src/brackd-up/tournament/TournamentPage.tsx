import { Button } from "react-bootstrap";
import Bracket from "../../bracket/Bracket";
import { useTournamentContext } from "../../context/TournamentContext";
import { Tournament } from "../../model/Tournament";
import "./tournamentpage.css";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function TournamentPage() {
    const {tournament} = useTournamentContext();

    if (tournament === null) {
        return <p>Something went wrong.</p>
    }
    if (tournament === undefined) {
        return <p>Loading...</p>
    }

    return <div className="tournament-page">
        <div className="tournament-info">
            <h3>{tournament.name}</h3>
            <TournamentInfoPlaylistEmbed tournament={tournament}/>
            <TournamentInfoCurrentVote tournament={tournament}/>
        </div>
        <div className="tournament-page-border"/>
        <div className="tournament-content">
            <Bracket tournament={tournament}/>
        </div>
    </div>
}

interface TournamentInfoProps {
    readonly tournament: Tournament;
}

function TournamentInfoPlaylistEmbed({tournament}: TournamentInfoProps) {
    const url = useMemo(() => {
        if (!tournament.spotifyPlaylist) {
            return undefined;
        }
        let url = tournament.spotifyPlaylist;
        if (!url.includes("embed")) {
            // convert url to embed url
            url = url.replace("spotify.com/playlist", "spotify.com/embed/playlist");
        }
        if (!url.includes("theme=0")) {
            // force theme=0
            const queryChar = url.includes("?") ? "&" : "?";
            url += queryChar + "theme=0";
        }
        return url;
    }, [tournament.spotifyPlaylist]);

    if (!url) {
        return <></>;
    }

    return (
        <iframe
            title="Spotify Playlist Embed"
            style={{borderRadius: "12px"}}
            src={url}
            width="100%"
            height="400"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
        />
    );
}

function TournamentInfoCurrentVote({tournament}: TournamentInfoProps) {
    const currentOrNextRound = useMemo(() => tournament.getCurrentOrNextRound(), [tournament]);

    if (!currentOrNextRound) {
        return <></>;
    }

    if (!currentOrNextRound.isActive()) {
        // not started yet
        return <p>{`Voting begins at ${currentOrNextRound.startDate!.toLocaleString()}`}</p>;
    }

    const text = tournament.mode === "SCHEDULED" ? `Voting ends at ${currentOrNextRound.endDate!.toLocaleString()}.` : "Voting is open.";

    return (
        <p className="vote-message">
            {text}
            <Link to={`/tournament/vote?id=${tournament.id}`}>
                <Button>Vote Now!</Button>
            </Link>
        </p>
    );
}