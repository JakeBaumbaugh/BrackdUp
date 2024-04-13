import { Moment } from "moment";
import { Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody } from "react-bootstrap";
import DateTime from "react-datetime";
import { useNavigate } from "react-router-dom";
import EntryCard from "../card/EntryCard";
import Entry from "../model/Entry";
import { TournamentRound } from "../model/Tournament";
import TournamentBuilder from "../model/TournamentBuilder";
import { getImageList, imageUrl } from "../service/ImageService";
import { createTournament, getTournamentTypes, searchEntries } from "../service/TournamentService";
import TournamentModeButtons from "./TournamentModeButtons";
import TournamentPrivacyButtons from "./TournamentPrivacyButtons";
import "./tournament-creation.css";
import ImageSelectionModal from "./ImageSelectionModal";
import TournamentType from "../model/TournamentType";

export default function TournamentCreationPage() {
    const [builder, setBuilder] = useState(new TournamentBuilder());
    const [page, setPage] = useState(0);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const valid = useMemo(() => builder.isValid(), [builder]);

    const handleSubmit = (e: FormEvent) => {
        setSaving(true);
        e.preventDefault();
        if(valid) {
            console.log("submitting", builder);
            createTournament(builder)
                .then(() => navigate("/"));
        }
    };

    let content: JSX.Element;
    switch(page) {
        case 0:
            content = <SetupPage builder={builder} setBuilder={setBuilder}/>;
            break;
        case 1:
            content = <EntrySelectPage builder={builder} setBuilder={setBuilder}/>;
            break;
        case 2:
            content = <SchedulePage builder={builder} setBuilder={setBuilder}/>;
            break;
        default:
            content = <p>Invalid Page</p>;
            break;
    }

    return (
        <main className="creation-page">
            <form onSubmit={handleSubmit}>
                {content}
                <div className="button-row">
                    <Button
                        type="button"
                        onClick={() => setPage(page => page - 1)}
                        disabled={page <= 0}
                    >BACK</Button>
                    {page === 2 ? (
                        <Button
                        type="submit"
                        key="submit-button"
                        variant={valid ? "success" : "danger"}
                        disabled={saving || !valid}
                    >SUBMIT</Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => setPage(page => page + 1)}
                            key="next-button"
                        >NEXT</Button>
                    )}
                </div>
            </form>
        </main>
    );
}

interface PageProps {
    builder: TournamentBuilder;
    setBuilder: Dispatch<SetStateAction<TournamentBuilder>>;
}

function SetupPage({builder, setBuilder}: PageProps) {
    const [tournamentTypes, setTournamentTypes] = useState<TournamentType[]>([]);
    const [imageIds, setImageIds] = useState<number[]>([]);
    const [showImageSelectionModal, setShowImageSelectionModal] = useState(false);

    useEffect(() => {
        getTournamentTypes()
            .then(types => setTournamentTypes(types));
        getImageList()
            .then(ids => setImageIds(ids));
    }, []);

    const selectTournamentType = (index: number) => {
        setBuilder(builder.setType(tournamentTypes[index]));
    };
    
    const tournamentTypeIndex = useMemo(() =>
        tournamentTypes.findIndex(type => type.type === builder.type.type)
    , [tournamentTypes, builder.type]);

    return (
        <div className="setup">
            <label>
                <span>Tournament Name</span>
                <input
                    type="text"
                    value={builder.name}
                    onChange={e => setBuilder(builder.setName(e.target.value))}
                />
            </label>
            <label>
                <span>Entry Count</span>
                <select value={builder.entryCount} onChange={e => setBuilder(builder.setEntryCount(parseInt(e.target.value)))}>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                    <option value="64">64</option>
                    <option value="128">128</option>
                </select>
            </label>
            <label>
                <span>Maximum Matches per Round</span>
                <select value={builder.matchesPerRound} onChange={e => setBuilder(builder.setMatchesPerRound(parseInt(e.target.value)))}>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                </select>
            </label>
            <label>
                <span>Tournament Type</span>
                <select value={tournamentTypeIndex} onChange={e => selectTournamentType(parseInt(e.target.value))}>
                    {tournamentTypes.map((type, index) => (
                        <option value={index} key={type.type}>{type.type}</option>
                    ))}
                </select>
            </label>
            <label>
                <span>Spotify Playlist</span>
                <input
                    type="text"
                    value={builder.spotifyPlaylist}
                    onChange={e => setBuilder(builder.setSpotifyPlaylist(e.target.value))}
                />
            </label>
            <TournamentModeButtons value={builder.mode} onSelect={mode => setBuilder(builder.setMode(mode))} />
            <TournamentPrivacyButtons value={builder.privacy} onSelect={privacy => setBuilder(builder.setPrivacy(privacy))} />
            <ImageSelectionModal
                show={showImageSelectionModal}
                onHide={() => setShowImageSelectionModal(false)}
                imageList={imageIds}
                image={1}
                onSelect={id => {
                    setBuilder(builder.setBackgroundImage(id));
                    setShowImageSelectionModal(false);
                }}
            />
            <div className="background-image-details">
                <Button onClick={() => setShowImageSelectionModal(true)}>Select Background Image</Button>
                {builder.backgroundImage && <img src={imageUrl(builder.backgroundImage)} alt=""/>}
            </div>
        </div>
    );
}

function EntrySelectPage({builder, setBuilder}: PageProps) {
    const [line1, setLine1] = useState("");
    const [line2, setLine2] = useState("");
    const [spotify, setSpotify] = useState("");
    const [youtube, setYoutube] = useState("");
    const [suggestions, setSuggestions] = useState<Entry[]>([]);

    useEffect(() => {
        // get suggestions
        refreshSuggestions(builder);
        // filter out already selected entries by id
        // TODO: set a timer to only retrieve suggestions after a pause between typing (debounce)
    }, [line1, line2]);

    const refreshSuggestions = (builder: TournamentBuilder) => {
        if(line1 || line2) {
            searchEntries(builder.type.type, line1, line2)
                .then(suggestions => {
                    suggestions = suggestions.filter(entry => !builder.hasEntry(entry));
                    setSuggestions(suggestions);
                });
        } else {
            setSuggestions([]);
        }
    };

    const addNewEntry = () => {
        const entry: Entry = {
            id: -1,
            line1: line1.trim(),
            line2: line2.trim() || undefined,
            spotify: spotify.trim() || undefined,
            youtube: youtube.trim() || undefined
        };
        // Line 1 must be present and either:
        // A) Line 2 must be present, B) Line 2 is disabled, or C) Type is MISC, so Line 2 is optional
        if (entry.line1 && (entry.line2 || !builder.type.line2 || builder.type.type === "MISC")) {
            addEntry(entry);
        }
    };

    const addEntry = (entry: Entry) => {
        if(builder.entries.length < builder.entryCount && !builder.hasEntry(entry)) {
            setBuilder(builder.addEntry(entry));
            setLine1("");
            setLine2("");
            setSpotify("");
            setYoutube("");
        }
    };

    const removeEntry = (entry: Entry) => {
        setBuilder(builder => {
            builder = builder.removeEntry(entry);
            refreshSuggestions(builder);
            return builder;
        });
    };

    return (
        <div className="entry-select">
            <div className="entry-input">
                <div className="entry-fields">
                    <label>
                        <span>{builder.type.line1Label}</span>
                        <input type="text" value={line1} onChange={e => setLine1(e.target.value)}/>
                    </label>
                    {builder.type.line2 && (
                        <label>
                            <span>{builder.type.line2Label ?? "Line 2"}</span>
                            <input type="text" value={line2} onChange={e => setLine2(e.target.value)}/>
                        </label>
                    )}
                    {builder.type.spotify && (
                        <label>
                            <span>Spotify Link</span>
                            <input type="text" value={spotify} onChange={e => setSpotify(e.target.value)}/>
                        </label>
                    )}
                    {builder.type.youtube && (
                        <label>
                            <span>Youtube Link</span>
                            <input type="text" value={youtube} onChange={e => setYoutube(e.target.value)}/>
                        </label>
                    )}
                </div>
                <button type="button" onClick={addNewEntry}>+</button>
                <div className="entry-suggestions">
                    <p>Suggestions:</p>
                    {suggestions.length > 0 ? suggestions.map(entry => (
                        <EntryCard
                            key={`${entry.id}-${entry.line1}-${entry.line2}`}
                            entry={entry}
                            onClick={() => addEntry(entry)}
                            selectable
                        />
                    )) : (line1 || line2) ? <p>No existing entries found.</p> : <p>Enter information to see suggestions.</p>}
                </div>
            </div>
            <div className="entry-collection">
                <p>Selected Entries ({builder.entries.length}/{builder.entryCount}):</p>
                {builder.entries.map(entry => (
                    <EntryCard 
                        key={`${entry.line1}-${entry.line2}`}
                        entry={entry}
                        onClick={() => removeEntry(entry)}
                        deletable
                    />
                ))}
            </div>
        </div>
    );
}

function SchedulePage({builder, setBuilder}: PageProps) {
    const firstRound = builder.levels[0].rounds[0];
    const disabled = builder.mode === "INSTANT";
    const cardClassName = "disabled-message" + (disabled ? "" : " hidden");

    const setStartDate = (value: string | Moment) => {
        if(typeof value !== "string") {
            setBuilder(builder.setStartDate(value.toDate()));
        }
    };

    const setEndDate = (value: string | Moment, round: TournamentRound) => {
        if(typeof value !== "string") {
            setBuilder(builder.setEndDate(value.toDate(), round));
        }
    };

    return (
        <div className="bracket-schedule">
            <DateTime 
                value={firstRound.startDate!}
                onChange={setStartDate}
                closeOnSelect
                inputProps={{disabled}}
            />
            {builder.levels.map(level => <div key={level.name}>
                {level.rounds.map((round, index) => <>
                    <p>{level.name}, Round {index + 1}</p>
                    <DateTime
                        value={round.endDate!}
                        onChange={value => setEndDate(value, round)}
                        closeOnSelect
                        inputProps={{disabled}}
                    />
                </>)}
            </div>)}
            <Card className={cardClassName}>
                <CardBody>
                    This page is disabled for INSTANT mode tournaments.
                </CardBody>
            </Card>
        </div>
    );
}