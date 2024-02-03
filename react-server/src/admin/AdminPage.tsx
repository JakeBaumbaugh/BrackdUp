import DataTable, { TableColumn } from "react-data-table-component";
import { useProfileContext } from "../context/ProfileContext";
import "./admin.css";
import { useEffect, useState } from "react";
import Profile from "../model/Profile";
import { getProfiles } from "../service/AdminService";
import ManageProfileModal from "./ManageProfileModal";

export default function AdminPage() {
    const {profile: [profile]} = useProfileContext();

    if (!profile?.isAdmin()) {
        return "Forbidden";
    }

    return <AdminContent/>;
}

const profileColumns: TableColumn<Profile>[] = [
    {
        name: "ID",
        selector: profile => profile.id,
        width: "8em"
    },
    {
        name: "Icon",
        selector: profile => profile.pictureLink ?? "",
        format: profile => profile.pictureLink ? <img src={profile.pictureLink} alt={`${profile.getName()}'s profile`}/> : "N/A",
        width: "8em"
    },
    {
        name: "Email",
        selector: profile => profile.email,
    },
    {
        name: "Name",
        selector: profile => profile.getName(),
    },
    {
        name: "Role",
        selector: profile => profile.role,
    }
];

function AdminContent() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [modalProfile, setModalProfile] = useState<Profile|null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getProfiles().then(profiles => setProfiles(profiles));
    }, []);

    const selectProfile = (profile: Profile) => {
        setModalProfile(profile);
        setShowModal(true);
    };

    const replaceProfile = (profile: Profile) => {
        const replaceIndex = profiles.findIndex(p => p.id === profile.id);
        if (replaceIndex !== -1) {
            setModalProfile(profile);
            setProfiles([...profiles.slice(0, replaceIndex), profile, ...profiles.slice(replaceIndex + 1)]);
        }
    };

    const removeProfile = (id: number) => {
        const replaceIndex = profiles.findIndex(p => p.id === id);
        setModalProfile(null);
        setProfiles([...profiles.slice(0, replaceIndex), ...profiles.slice(replaceIndex + 1)]);
    };

    return (
        <main className="admin-page">
            <h3>Profiles</h3>
            <DataTable
                columns={profileColumns}
                data={profiles}
                pagination
                striped
                onRowClicked={selectProfile}
                highlightOnHover
                pointerOnHover
            />
            <ManageProfileModal
                profile={modalProfile}
                show={showModal}
                onHide={() => setShowModal(false)}
                replaceProfile={replaceProfile}
                removeProfile={removeProfile}
            />
        </main>
    );
}