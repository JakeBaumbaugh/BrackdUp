import { useEffect, useState } from "react";
import { Tournament } from "../model/Tournament";
import CountdownTimer from "../list/CountdownTimer";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "./votemodal.css";
import { useLoadingScreenContext } from "../context/LoadingScreenContext";
import { useTournamentContext } from "../context/TournamentContext";

interface VoteDialogProps {
    tournament: Tournament;
}

export default function VoteModal({tournament}: VoteDialogProps) {
    const navigate = useNavigate();
    const [show, setShow] = useState(true);
    const [loading] = useLoadingScreenContext();
    const {userVotes} = useTournamentContext();

    const closeModal = () => setShow(false);
    const navigateToVotePage = () => navigate(`/tournament/vote?id=${tournament.id}`);

    const votableRound = tournament.getVotableRound();
    useEffect(() => {
        setShow(!!votableRound && !!userVotes && userVotes.size === 0);
    }, [votableRound, userVotes]);

    
    return (
        <Modal show={show && !loading} onHide={closeModal} centered className="vote-modal">
            <Modal.Header closeButton>
                <Modal.Title>
                    {votableRound && <VoteDialogText endDate={votableRound.endDate} onCountdownComplete={closeModal}/>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="danger" onClick={navigateToVotePage}>Vote Now</Button>
                <Button variant="secondary" onClick={closeModal}>Later</Button>
            </Modal.Footer>
        </Modal>
    );
}

interface VoteDialogTextProps {
    endDate: Date|null;
    onCountdownComplete?: () => void;
}

function VoteDialogText({endDate, onCountdownComplete}: VoteDialogTextProps) {
    if (endDate === null) {
        return <>Voting is open!</>
    }

    const effectiveEndDate = new Date(endDate.valueOf() - 60 * 1000);
    const currentDate = new Date(Date.now());
    const sameDay = currentDate.getDate() === effectiveEndDate.getDate()
                    && currentDate.getMonth() === effectiveEndDate.getMonth()
                    && currentDate.getFullYear() === effectiveEndDate.getFullYear();
    
    return sameDay ? (
        // countdown timer
        <CountdownTimer endDate={endDate} onComplete={onCountdownComplete}/>
    ) : (
        <>Voting ends on {effectiveEndDate.getMonth() + 1}/{effectiveEndDate.getDate()}.</>
    );
}