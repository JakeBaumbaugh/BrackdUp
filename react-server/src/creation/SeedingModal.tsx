import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { DroppableEntryListCard, SortableEntryListCard } from "../card/EntryListCard";
import Entry from "../model/Entry";
import TournamentBuilder from "../model/TournamentBuilder";
import "./seeding-modal.css";
import { useDrop } from "react-dnd";

interface SeedingModalProps {
    show: boolean;
    closeModal: () => void;
    onSubmit: () => void;
    builder: TournamentBuilder;
    setBuilder: Dispatch<SetStateAction<TournamentBuilder>>;
    tiered?: boolean;
}

export default function SeedingModal({show, closeModal, onSubmit, builder, setBuilder, tiered}: SeedingModalProps) {
    const [page, setPage] = useState(0);

    useEffect(() => setPage(0), [show]);

    const hasDivisions = builder.divisions.length > 0;
    const maxPage = hasDivisions ? builder.divisions.length - 1 : 0;

    const entries = hasDivisions ? builder.divisions[page] : builder.entries;
    const seedingOrder = builder.seedingOrder[page];
    const seedingTiers = builder.tieredSeedingOrder[page];
    const entryBank = entries.filter(entry => {
        if (tiered) {
            return !seedingTiers.some(tier => tier.includes(entry))
        } else {
            return !seedingOrder.includes(entry);
        }
    });

    const disableNextButton = entryBank.length !== 0;

    const removeEntry = (entry: Entry) => {
        if (tiered) {
            setBuilder(builder => builder.removeFromTieredSeeding(entry));
        } else {
            setBuilder(builder => builder.removeFromSeeding(entry));
        }
    };
    const addEntry = (index: number, entry: Entry) => setBuilder(builder => builder.addToSeeding(entry, index, page));
    const addEntryToTier = (entry: Entry, tier: number) => setBuilder(builder => builder.addToTieredSeeding(entry, tier, page));
    const addEntryNewTier = (entry: Entry) => setBuilder(builder => builder.addToTieredSeeding(entry, seedingTiers.length, page));

    return (
        <Modal show={show} onHide={closeModal} centered size="lg" className="seeding-modal">
            <Modal.Body>
                <DroppableEntryListCard
                    title="ENTRY BANK"
                    entries={entryBank}
                    stickyTitle
                    onDrop={removeEntry}
                />
                <div className="card-column">
                    {tiered ? seedingTiers.map((tier, tierIndex) => (
                        <DroppableEntryListCard
                            title={`TIER ${tierIndex+1}`}
                            entries={tier}
                            stickyTitle
                            onDrop={entry => addEntryToTier(entry, tierIndex)}
                        />
                    )) : (
                        <SortableEntryListCard
                            title="SEEDED LIST"
                            entries={seedingOrder}
                            stickyTitle
                            onDrop={addEntry}
                        />
                    )}
                    {tiered && <DroppableAddCard onDrop={addEntryNewTier}/>}
                </div>
            </Modal.Body>
            <Modal.Footer>
                {page === maxPage ? (
                    <Button onClick={onSubmit} disabled={disableNextButton}>Done</Button>
                ) : (
                    <Button onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={disableNextButton}>Next</Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

function DroppableAddCard({onDrop}: {onDrop: (entry: Entry) => void}) {
    const [_, dropRef] = useDrop<Entry>(() => ({
        accept: "entry",
        drop: onDrop,
    }), [onDrop]);

    return (
        <Card className="droppable-add-card" ref={dropRef}>+</Card>
    );
}