import { Dispatch, SetStateAction, useMemo } from "react";
import { MatchFocus } from "../../bracket/Bracket";
import { TournamentRound } from "../../model/Tournament";
import { Button } from "react-bootstrap";

interface VoteControllerProps {
    voteMode: boolean;
    jumpMatchFocus: (jumpCount: number) => void;
}

export default function VoteController({voteMode, jumpMatchFocus}: Readonly<VoteControllerProps>) {
    const nextMatch = () => jumpMatchFocus(1);
    const prevMatch = () => jumpMatchFocus(-1);

    const className = voteMode ? "vote-controller" : "vote-controller hide";

    return <div className={className}>
        <Button onClick={prevMatch}>{"<"}</Button>
        <Button onClick={nextMatch}>{">"}</Button>
    </div>
}