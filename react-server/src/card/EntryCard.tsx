import { PropsWithChildren, useRef } from "react";
import { BracketEntry } from "../model/Entry";
import "./entrycard.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface EntryCardProps {
    entry: BracketEntry|null;
    final?: boolean;
    votedFor?: boolean;
    onClick?: () => void;
    deletable?: boolean;
    selectable?: boolean;
}

export default function EntryCard({entry, final, votedFor, onClick, deletable, selectable}: EntryCardProps) {
    let cardClass = "custom-card entry-card";
    if (final) {
        cardClass += " final";
    }
    if(entry?.activeRound) {
        cardClass += " active";
    }
    if(votedFor) {
        cardClass += " selected";
    }
    if(onClick) {
        cardClass += " clickable";
    }
    if(deletable) {
        cardClass += " deletable";
    }
    if(selectable) {
        cardClass += " selectable";
    }

    return (
        <div className="entry-card-wrapper">
            <div className={cardClass} onClick={onClick}>
                <div>
                    <OverflowTooltip>{entry?.line1}</OverflowTooltip>
                </div>
                {entry?.line2 && <div>
                    <OverflowTooltip>{entry?.line2}</OverflowTooltip>
                </div>}
            </div>
            {entry?.receivedVoteCount !== undefined && entry.totalVoteCount !== undefined && entry.totalVoteCount > 0 && (
                <span className="tag after-tag">{Math.round(100 * entry.receivedVoteCount / entry.totalVoteCount)}%</span>
            )}
        </div>
    );
}

function OverflowTooltip({children}: PropsWithChildren) {
    const ref = useRef<HTMLDivElement>(null);
    const overflow = ref.current && (ref.current.scrollWidth > ref.current.offsetWidth);
    const content = <div ref={ref}>{children}</div>;

    return overflow ? (
        <OverlayTrigger placement="auto" overlay={
            <Tooltip id="x">{children}</Tooltip>
        }>
            {content}
        </OverlayTrigger>
    ) : content;
}