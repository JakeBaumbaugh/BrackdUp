import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTournamentContext } from "../context/TournamentContext";

interface VoteControllerProps {
    voteMode: boolean;
    endVoteMode: () => void;
    jumpMatchFocus: (jumpCount: number) => void;
}

export default function VoteController({voteMode, endVoteMode, jumpMatchFocus}: Readonly<VoteControllerProps>) {
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const {tournament, userVotes} = useTournamentContext();
    const matchCount = tournament?.getVotableRound()?.matches.length ?? 0;
    const allVotesSubmitted = userVotes?.size === matchCount;

    const nextMatch = () => jumpMatchFocus(1);
    const prevMatch = () => jumpMatchFocus(-1);
    const onFinish = () => {
        if (allVotesSubmitted) {
            endVoteMode();
        } else {
            setShowConfirmationModal(true);
        }
    };

    const onModalCancel = () => setShowConfirmationModal(false);
    const onModalConfirm = () => {
        endVoteMode();
        setShowConfirmationModal(false);
    };

    const className = voteMode ? "vote-controller" : "vote-controller hide";
    const finishButtonVariant = allVotesSubmitted ? "success" : "secondary";

    return <div className={className} key={`${showConfirmationModal}`}>
        <Button onClick={prevMatch}>{"<"}</Button>
        <Button onClick={onFinish} variant={finishButtonVariant}>FINISH</Button>
        <Button onClick={nextMatch}>{">"}</Button>
        <ConfirmationModal show={showConfirmationModal} cancel={onModalCancel} confirm={onModalConfirm}/>
    </div>
}

interface ModalProps {
    show: boolean;
    cancel: () => void;
    confirm: () => void;
}

function ConfirmationModal({show, cancel, confirm}: Readonly<ModalProps>) {
    return <Modal show={show} className="confirmation-modal" centered>
        <Modal.Body>
            <h2>Are you sure?</h2>
            <p>You have not voted on everything.</p>
            <div className="action-buttons">
                <Button onClick={cancel}>GO BACK</Button>
                <Button onClick={confirm} variant="secondary">CONFIRM</Button>
            </div>
        </Modal.Body>
    </Modal>
}