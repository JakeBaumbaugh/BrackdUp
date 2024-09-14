import { useMemo } from "react";
import { Button } from "react-bootstrap";
import { MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { useProfileContext } from "../../context/ProfileContext";
import { Tournament } from "../../model/Tournament";

interface TournamentInfoProps {
    tournament: Tournament;
    startVoteMode: () => void;
}

export default function TournamentInfo({tournament, startVoteMode}: Readonly<TournamentInfoProps>) {
    return <div className="tournament-info">
        <h3>{tournament.name}</h3>
        {tournament.spotifyPlaylist && <TournamentInfoPlaylistEmbed spotifyLink={tournament.spotifyPlaylist}/>}
        <TournamentInfoCurrentVote tournament={tournament} startVoteMode={startVoteMode}/>
        <TournamentManage tournament={tournament}/>
    </div>
}

function TournamentInfoPlaylistEmbed({spotifyLink}: Readonly<{spotifyLink: string}>) {
    const url = useMemo(() => {
        let url = spotifyLink;
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
    }, [spotifyLink]);

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

function TournamentInfoCurrentVote({tournament, startVoteMode}: Readonly<TournamentInfoProps>) {
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
            <Button onClick={startVoteMode}>Vote Now!</Button>
        </p>
    );
}

function TournamentManage({tournament}: Readonly<{tournament: Tournament}>) {
    const {profile: [profile]} = useProfileContext();

    return profile?.canEditTournament(tournament) ? (
        <Link to={`/tournament/settings?id=${tournament.id}`}>
            <Button className="icon-text-button">
                <MdSettings/>
                <span>Manage</span>
            </Button>
        </Link>
    ) : <></>
}