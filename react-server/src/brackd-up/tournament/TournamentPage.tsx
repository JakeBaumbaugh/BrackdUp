import { useMemo, useState } from "react";
import { Button, ButtonGroup, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { MdInfoOutline, MdSettings } from "react-icons/md";
import Bracket, { MatchFocus } from "../../bracket/Bracket";
import { useProfileContext } from "../../context/ProfileContext";
import { useTournamentContext } from "../../context/TournamentContext";
import { Tournament, TournamentRound } from "../../model/Tournament";
import VoteController from "./VoteController";
import "./tournamentpage.css";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { RiStackshareLine } from "react-icons/ri";
import TournamentInfo from "./TournamentInfo";

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

    const isDesktop = useMediaQuery({ minWidth: 600 });

    if (tournament === null) {
        return <p>Something went wrong.</p>
    }
    if (tournament === undefined) {
        return <p>Loading...</p>
    }

    const props = {tournament, currentRound, voteMode, startVoteMode, matchFocus, jumpMatchFocus};

    return isDesktop ? <DesktopView {...props}/> : <MobileView {...props}/>;
}

interface ViewProps {
    tournament: Tournament;
    currentRound: TournamentRound | undefined;
    voteMode: boolean;
    startVoteMode: () => void;
    matchFocus: MatchFocus;
    jumpMatchFocus: (offset: number) => void;
}

function DesktopView({tournament, currentRound, voteMode, startVoteMode, matchFocus, jumpMatchFocus}: Readonly<ViewProps>) {
    return <div className="tournament-page">
        <TournamentInfo tournament={tournament} startVoteMode={startVoteMode}/>
        <div className="tournament-page-border"/>
        <div className="tournament-content">
            <Bracket tournament={tournament} voteMode={voteMode} matchFocus={matchFocus} jumpMatchFocus={jumpMatchFocus}/>
            {currentRound && (
                <VoteController voteMode={voteMode} jumpMatchFocus={jumpMatchFocus}/>
            )}
        </div>
    </div>
}

type Tab = "BRACKET" | "INFO";

function MobileView({tournament, currentRound, voteMode, startVoteMode, matchFocus, jumpMatchFocus}: Readonly<ViewProps>) {
    const [tab, setTab] = useState<Tab>("BRACKET");

    let pageContent;

    switch (tab) {
        case "BRACKET":
            pageContent = <Bracket tournament={tournament} voteMode={voteMode} matchFocus={matchFocus} jumpMatchFocus={jumpMatchFocus}/>;
            break;
        case "INFO":
            pageContent = <TournamentInfo tournament={tournament} startVoteMode={startVoteMode}/>;
            break;
    }

    return <div className="tournament-page">
        <div className="tournament-content">
            {pageContent}
        </div>
            <ToggleButtonGroup className="tab-selector" type="radio" name="tab" value={tab} onChange={value => setTab(value)}>
                <ToggleButton id="bracket-tab-btn" value="BRACKET" variant="outline-primary">
                    <RiStackshareLine/>
                    <span>BRACKET</span>
                </ToggleButton>
                <ToggleButton id="info-tab-btn" value="INFO" variant="outline-primary">
                    <MdInfoOutline/>
                    <span>INFO</span>
                </ToggleButton>
            </ToggleButtonGroup>
    </div>
}