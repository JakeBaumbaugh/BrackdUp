import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminPage from "../admin/AdminPage";
import { LoadingScreenContext } from "../context/LoadingScreenContext";
import { ProfileContext } from "../context/ProfileContext";
import TournamentManager from "../context/TournamentManager";
import TournamentCreationPage from "../creation/TournamentCreationPage";
import Profile from "../model/Profile";
import { checkCookies } from "../service/ProfileService";
import TournamentSettingsPage from "../settings/TournamentSettingsPage";
import HomePage from "../home/HomePage";
import TournamentPage from "../tournament/TournamentPage";
import Header from "./Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datetime/css/react-datetime.css";
import "./app.css";

export default function App() {
    const profileState = useState<Profile|undefined|null>(undefined);
    const forceLoginState = useState<boolean>(true);
    const loadingScreenState = useState<boolean>(false);

    const profileContext = useMemo(() => ({
        profile: profileState, forceLogin: forceLoginState
    }), [profileState, forceLoginState]);

    const [, setProfile] = profileState;
    const [, setForceLogin] = forceLoginState;
    useEffect(() => {
        checkCookies()
            .then(profile => setProfile(profile))
            .then(() => setForceLogin(false))
            .catch(() => setProfile(null));
    }, []);

    return (
        <ProfileContext.Provider value={profileContext}>
            <TournamentManager>
                <LoadingScreenContext.Provider value={loadingScreenState}>
                    <div className="App">
                        <Header/>
                        <main>
                            <Routes>
                                <Route path="/" Component={HomePage}/>
                                <Route path="/tournament" Component={TournamentPage} />
                                <Route path="/tournament/settings" Component={TournamentSettingsPage} />
                                <Route path="/tournament/new" Component={TournamentCreationPage} />
                                <Route path="/admin" Component={AdminPage} />
                            </Routes>
                        </main>
                    </div>
                </LoadingScreenContext.Provider>
            </TournamentManager>
        </ProfileContext.Provider>
    );
}
