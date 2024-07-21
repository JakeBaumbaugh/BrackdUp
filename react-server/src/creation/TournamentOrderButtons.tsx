import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { TournamentOrder } from "../model/TournamentBuilder";

interface TournamentOrderButtonsProps {
    value: TournamentOrder | null;
    onSelect: (order: TournamentOrder) => void;
}

export default function TournamentOrderButtons({value, onSelect}: TournamentOrderButtonsProps) {
    return (
        <ButtonGroup className="tournament-settings-button-group">
            <ToggleButton
                id="random-order-button"
                type="radio"
                value="RANDOM"
                checked={value === "RANDOM"}
                onClick={() => onSelect("RANDOM")}
            >
                <p>Randomized</p>
            </ToggleButton>
            <ToggleButton
                id="inorder-order-button"
                type="radio"
                value="INORDER"
                checked={value === "INORDER"}
                onClick={() => onSelect("INORDER")}
            >
                <p>In Order</p>
            </ToggleButton>
            <ToggleButton
                id="seeded-order-button"
                type="radio"
                value="SEEDED"
                checked={value === "SEEDED"}
                onClick={() => onSelect("SEEDED")}
            >
                <p>Seeded</p>
            </ToggleButton>
            <ToggleButton
                id="tieredseeds-order-button"
                type="radio"
                value="TIEREDSEEDS"
                checked={value === "TIEREDSEEDS"}
                onClick={() => onSelect("TIEREDSEEDS")}
            >
                <p>Tiered Seeds</p>
            </ToggleButton>
        </ButtonGroup>
    );
}