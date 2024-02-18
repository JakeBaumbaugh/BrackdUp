import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { MdOutlineTimer } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { TournamentMode } from "../model/Tournament";

interface TournamentModeButtonsProps {
    value: TournamentMode;
    onSelect: (mode: TournamentMode) => void;
}

export default function TournamentModeButtons({value, onSelect}: TournamentModeButtonsProps) {
    return (
        <ButtonGroup className="tournament-settings-button-group">
            <ToggleButton
                id="public-privacy-button"
                type="radio"
                value="PUBLIC"
                checked={value === "SCHEDULED"}
                onClick={() => onSelect("SCHEDULED")}
            >
                <MdOutlineTimer size={20}/>
                <p>Scheduled</p>
            </ToggleButton>
            <ToggleButton
                id="public-privacy-button"
                type="radio"
                value="VISIBLE"
                checked={value === "INSTANT"}
                onClick={() => onSelect("INSTANT")}
            >
                <IoMdCheckboxOutline size={20}/>
                <p>Instant</p>
            </ToggleButton>
        </ButtonGroup>
    );
}