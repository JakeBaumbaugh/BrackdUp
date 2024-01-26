import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { MdLockOpen, MdLockOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { TournamentPrivacy } from "../model/Tournament";
import "./tournament-privacy-buttons.css";

interface TournamentPrivacyButtonsProps {
    value: TournamentPrivacy;
    onSelect: (privacy: TournamentPrivacy) => void;
}

export default function TournamentPrivacyButtons({value, onSelect}: TournamentPrivacyButtonsProps) {
    return (
        <ButtonGroup className="tournament-privacy-buttons">
            <ToggleButton
                id="public-privacy-button"
                type="radio"
                value="PUBLIC"
                checked={value === "PUBLIC"}
                onClick={() => onSelect("PUBLIC")}
            >
                <MdLockOpen size={20}/>
                <p>Public</p>
            </ToggleButton>
            <ToggleButton
                id="public-privacy-button"
                type="radio"
                value="VISIBLE"
                checked={value === "VISIBLE"}
                onClick={() => onSelect("VISIBLE")}
            >
                <MdOutlineRemoveRedEye size={20}/>
                <p>Visible</p>
            </ToggleButton>
            <ToggleButton
                id="public-privacy-button"
                type="radio"
                value="PRIVATE"
                checked={value === "PRIVATE"}
                onClick={() => onSelect("PRIVATE")}
            >
                <MdLockOutline size={20}/>
                <p>Private</p>
            </ToggleButton>
        </ButtonGroup>
    );
}