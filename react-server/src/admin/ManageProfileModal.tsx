import { Button, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { FaSave, FaTrash } from "react-icons/fa";
import Profile, { ProfileRole } from "../model/Profile";
import { useEffect, useState } from "react";
import { deleteProfile, updateProfile } from "../service/AdminService";

interface ManageProfileModalProps {
    profile: Profile | null;
    show: boolean;
    onHide: () => void;
    replaceProfile: (profile: Profile) => void;
    removeProfile: (id: number) => void;
}

export default function ManageProfileModal({profile, show, onHide, replaceProfile, removeProfile}: ManageProfileModalProps) {
    const fullName = profile?.getName();

    const [firstName, setFirstName] = useState(profile?.firstName ?? "");
    const [lastName, setLastName] = useState(profile?.lastName ?? "");
    const [role, setRole] = useState(profile?.role ?? "USER");
    const [disableButtons, setDisableButtons] = useState(false);

    useEffect(() => {
        setFirstName(profile?.firstName ?? "");
        setLastName(profile?.lastName ?? "");
        setRole(profile?.role ?? "USER");
        setDisableButtons(false);
    }, [profile]);

    const onSave = () => {
        if (profile) {
            const profileToSave = profile?.copy();
            profileToSave.firstName = firstName;
            profileToSave.lastName = lastName;
            profileToSave.role = role;
            setDisableButtons(true);
            updateProfile(profileToSave).then(profile => {
                setDisableButtons(false);
                if (profile) {
                    replaceProfile(profile);
                    onHide();
                }
            });
        }
    };

    const onDelete = () => {
        if (profile) {
            setDisableButtons(true);
            deleteProfile(profile.id).then(res => {
                setDisableButtons(false);
                if (res.ok) {
                    removeProfile(profile.id);
                    onHide();
                }
            });
        }
    };

    return (
        <Modal show={show && profile !== null} onHide={onHide} className="profile-modal">
            <ModalHeader closeButton>
                {profile?.pictureLink && <img src={profile.pictureLink} alt={`${fullName}'s profile`}/>}
                <p>{profile?.email}</p>
            </ModalHeader>
            <ModalBody>
                <label>
                    <span>First Name</span>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </label>
                <label>
                    <span>Last Name</span>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                </label>
                <label>
                    <span>Role</span>
                    <select value={role} onChange={e => setRole(e.target.value as ProfileRole)}>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </label>
                <div className="action-buttons">
                    <Button variant="danger" onClick={onDelete} disabled={disableButtons}>
                        <FaTrash size="1.25em"/>
                    </Button>
                    <Button className="save-button" onClick={onSave} disabled={disableButtons}>
                        <FaSave size="1.25em"/>
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
}