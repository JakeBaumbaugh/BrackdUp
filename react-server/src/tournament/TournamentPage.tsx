import { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { MdInfoOutline } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import Bracket, { MatchFocus } from "../bracket/Bracket";
import { useTournamentContext } from "../context/TournamentContext";
import { Tournament, TournamentRound } from "../model/Tournament";
import LogoSvg from "../app/Logo";
import TournamentBackground from "./TournamentBackground";
import TournamentInfo from "./TournamentInfo";
import VoteController from "./VoteController";
import "./tournamentpage.css";

export default function TournamentPage() {
    const {tournament} = useTournamentContext();
    const [matchFocus, setMatchFocus] = useState<MatchFocus>({});
    const [voteMode, setVoteMode] = useState(false);

    const currentRound = tournament?.getVotableRound();

    useEffect(() => setVoteMode(false), [currentRound?.id]);

    const startVoteMode = () => {
        if (currentRound) {
            setVoteMode(true);
            setMatchFocus({focusId: currentRound?.matches[0].id});
        }
    };

    const endVoteMode = () => setVoteMode(false);

    const jumpMatchFocus = (offset: number) => setMatchFocus(matchFocus => {
        const matches = currentRound?.matches ?? [];
        const lastId = matchFocus.focusId ?? matchFocus.lastVotedId;
        if (!lastId) {
            return {focusId: matches[0].id};
        }
        const index = matches.findIndex(match => match.id === lastId);
        if (index == -1) {
            return {focusId: matches[0].id};
        }
        const nextIndex = (index + offset) % matches.length;
        return {focusId: matches.at(nextIndex)!.id};
    });

    const isDesktop = useMediaQuery({ minWidth: 600 });

    if (tournament === null) {
        return <p>Something went wrong.</p>
    }
    if (tournament === undefined) {
        return <p>Loading...</p>
    }

    const props = {tournament, currentRound, voteMode, startVoteMode, endVoteMode, matchFocus, jumpMatchFocus};

    return isDesktop ? <DesktopView {...props}/> : <MobileView {...props}/>;
}

interface ViewProps {
    tournament: Tournament;
    currentRound: TournamentRound | undefined;
    voteMode: boolean;
    startVoteMode: () => void;
    endVoteMode: () => void;
    matchFocus: MatchFocus;
    jumpMatchFocus: (offset: number) => void;
}

function DesktopView({tournament, currentRound, voteMode, startVoteMode, endVoteMode, matchFocus, jumpMatchFocus}: Readonly<ViewProps>) {
    return <div className="tournament-page">
        <TournamentInfo tournament={tournament} startVoteMode={startVoteMode}/>
        <div className="tournament-page-border"/>
        <div className="tournament-content">
            <TournamentBackground tournament={tournament}/>
            <Bracket tournament={tournament} voteMode={voteMode} matchFocus={matchFocus}/>
            {currentRound && (
                <VoteController voteMode={voteMode} endVoteMode={endVoteMode} jumpMatchFocus={jumpMatchFocus}/>
            )}
        </div>
    </div>
}

type Tab = "BRACKET" | "INFO";

function MobileView({tournament, currentRound, voteMode, startVoteMode, endVoteMode, matchFocus, jumpMatchFocus}: Readonly<ViewProps>) {
    const [tab, setTab] = useState<Tab>("BRACKET");

    const beginVote = () => {
        setTab("BRACKET");
        startVoteMode();
    };

    let pageContent;
    switch (tab) {
        case "BRACKET":
            pageContent = <>
                <TournamentBackground tournament={tournament}/>
                <Bracket tournament={tournament} voteMode={voteMode} matchFocus={matchFocus}/>
                {currentRound && <VoteController voteMode={voteMode} endVoteMode={endVoteMode} jumpMatchFocus={jumpMatchFocus}/>}
            </>;
            break;
        case "INFO":
            pageContent = <TournamentInfo tournament={tournament} startVoteMode={beginVote}/>;
            break;
    }

    return <div className="tournament-page">
        <div className="tournament-content">
            {pageContent}
        </div>
            <ToggleButtonGroup className="tab-selector" type="radio" name="tab" value={tab} onChange={value => setTab(value)}>
                <ToggleButton id="bracket-tab-btn" value="BRACKET" variant="outline-primary">
                    <LogoSvg/>
                    <span>BRACKET</span>
                </ToggleButton>
                <ToggleButton id="info-tab-btn" value="INFO" variant="outline-primary">
                    <MdInfoOutline/>
                    <span>INFO</span>
                </ToggleButton>
            </ToggleButtonGroup>
    </div>
}