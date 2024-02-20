import { Button, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { imageUrl } from "../service/ImageService";
import "./image-selection-modal.css";

interface ImageSelectionModalProps {
    show: boolean;
    onHide: () => void;
    imageList: number[];
    image: number|undefined;
    onSelect: (image: number|undefined) => void;
}

export default function ImageSelectionModal({show, onHide, imageList, image, onSelect}: ImageSelectionModalProps) {
    return (
        <Modal show={show} onHide={onHide} className="image-selection-modal" size="xl">
            <ModalHeader closeButton>Select a Background Image</ModalHeader>
            <ModalBody>
                {imageList.map(id => (
                    <Button key={`${id}`} onClick={() => onSelect(id)}>
                        <img src={imageUrl(id)}/>
                    </Button>
                ))}
                <Button variant="danger" onClick={() => onSelect(undefined)}>X</Button>
            </ModalBody>
        </Modal>
    );
}