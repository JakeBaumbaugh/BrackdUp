import { Fragment } from "react";
import { Card } from "react-bootstrap";
import { useDrop } from "react-dnd";
import Entry, { entryKey } from "../model/Entry";
import EntryCard, { DraggableEntryCard } from "./EntryCard";
import "./entrylistcard.css";

interface EntryListCardProps {
    title: string;
    entries: Entry[];
    className?: string;
    stickyTitle?: boolean;
}

export default function EntryListCard({title, entries, className, stickyTitle}: EntryListCardProps) {
    const cardClass = "entry-list-card " + (className ?? "");
    const titleClass = stickyTitle ? "sticky-title" : "";
    return (
        <Card className={cardClass}>
            <Card.Body>
                <p className={titleClass}>{title}</p>
                {entries.map(entry => (
                    <EntryCard entry={entry} key={entryKey(entry)}/>
                ))}
            </Card.Body>
        </Card>
    );
}

interface DroppableEntryListCardProps extends EntryListCardProps {
    onDrop: (item: Entry) => void;
    maxSize?: number;
}

export function DroppableEntryListCard({title, entries, className, stickyTitle, onDrop, maxSize}: DroppableEntryListCardProps) {
    const [_, dropRef] = useDrop<Entry>(() => ({
        accept: "entry",
        canDrop: maxSize ? (() => entries.length < maxSize) : undefined,
        drop: onDrop,
    }), [entries.length, maxSize]);

    const cardClass = "entry-list-card " + (className ?? "");

    const full = maxSize && entries.length === maxSize;
    const overfull = maxSize && entries.length > maxSize;
    const titleClass = (overfull ? "overfull" : full ? "full" : "") + (stickyTitle ? " sticky-title" : "");

    return (
        <Card className={cardClass} ref={dropRef}>
            <Card.Body>
                <p className={titleClass}>{title}</p>
                {entries.map(entry => (
                    <DraggableEntryCard entry={entry} key={entryKey(entry)}/>
                ))}
            </Card.Body>
        </Card>
    );
}

interface SortableEntryListCardProps extends EntryListCardProps {
    onDrop: (index: number, item: Entry) => void;
    maxSize?: number;
    numbered?: boolean;
}

export function SortableEntryListCard({title, entries, className, stickyTitle, onDrop, maxSize, numbered}: SortableEntryListCardProps) {
    const cardClass = "entry-list-card " + (className ?? "");

    const full = maxSize && entries.length === maxSize;
    const overfull = maxSize && entries.length > maxSize;
    const titleClass = (overfull ? "overfull" : full ? "full" : "") + (stickyTitle ? " sticky-title" : "");

    return (
        <Card className={cardClass}>
            <Card.Body>
                <p className={titleClass}>{title}</p>
                {entries.map((entry, index) => <Fragment key={entryKey(entry)}>
                    <SortableDropZone onDrop={entry => onDrop(index, entry)}/>
                    <div className="numbered-card-wrapper">
                        <span>{index + 1}.</span>
                        <DraggableEntryCard entry={entry}/>
                    </div>
                </Fragment>)}
                <SortableDropZone onDrop={entry => onDrop(entries.length, entry)}/>
            </Card.Body>
        </Card>
    );
}

interface SortableDropZoneProps {
    onDrop: (item: Entry) => void;
}

function SortableDropZone({onDrop}: SortableDropZoneProps) {
    const [{hover, toFront}, dropRef] = useDrop<Entry, unknown, Record<string, boolean>>(() => ({
        accept: "entry",
        drop: entry => onDrop(entry),
        collect: monitor => ({
            hover: monitor.isOver(),
            toFront: monitor.canDrop(),
        }),
    }), [onDrop]);

    let className = "sortable-drop-zone";
    if (hover) {
        className += " hover";
    }
    if (toFront) {
        className += " toFront";
    }

    return (
        <div className={className} ref={dropRef}>
            <hr/>
        </div>
    );
}