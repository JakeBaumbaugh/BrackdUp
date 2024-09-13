import { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { MdSettings } from "react-icons/md";
import Bracket, { MatchFocus } from "../../bracket/Bracket";
import { useProfileContext } from "../../context/ProfileContext";
import { useTournamentContext } from "../../context/TournamentContext";
import { Tournament } from "../../model/Tournament";
import VoteController from "./VoteController";
import "./tournamentpage.css";
import { Link } from "react-router-dom";

export default function TournamentPage() {
    const {tournament} = useTournamentContext();
    const [matchFocus, setMatchFocus] = useState<MatchFocus>({match: undefined});
    const [voteMode, setVoteMode] = useState(false);

    const currentRound = tournament?.getVotableRound();

    const startVoteMode = () => {
        if (currentRound) {
            setVoteMode(true);
            setMatchFocus({match: currentRound?.matches[0]});
        }
    };

    const jumpMatchFocus = (offset: number) => setMatchFocus(matchFocus => {
        const matches = currentRound?.matches ?? [];
        if (!matchFocus.match) {
            return {match: matches[0]};
        }
        const index = matches.indexOf(matchFocus.match);
        if (index == -1) {
            return {match: matches[0]};
        }
        const nextIndex = (index + offset) % matches.length;
        return {match: matches.at(nextIndex)};
    });

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
            <TournamentInfoCurrentVote tournament={tournament} startVoteMode={startVoteMode}/>
            <TournamentManage tournament={tournament}/>
        </div>
        <div className="tournament-page-border"/>
        <div className="tournament-content">
            <Bracket tournament={tournament} voteMode={voteMode} matchFocus={matchFocus} jumpMatchFocus={jumpMatchFocus}/>
            {currentRound && (
                <VoteController voteMode={voteMode} jumpMatchFocus={jumpMatchFocus}/>
            )}
        </div>
    </div>
}

interface TournamentInfoProps {
    tournament: Tournament;
    startVoteMode?: () => void;
}

function TournamentInfoPlaylistEmbed({tournament}: Readonly<TournamentInfoProps>) {
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

function TournamentManage({tournament}: Readonly<TournamentInfoProps>) {
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