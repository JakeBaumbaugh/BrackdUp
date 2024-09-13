import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useMemo, useState } from "react";
import "react-datetime/css/react-datetime.css";
import { Route, Routes } from "react-router-dom";
import LoadingScreen from "../../app/LoadingScreen";
import { LoadingScreenContext } from "../../context/LoadingScreenContext";
import TournamentManager from "../../context/TournamentManager";
import { ProfileContext } from "../../context/ProfileContext";
import Profile from "../../model/Profile";
import { checkCookies } from "../../service/ProfileService";
import "./app.css";
import Header from "./Header";
import HomePage from "../home/HomePage";
import TournamentPage from "../tournament/TournamentPage";

export default function App() {
    const profileState = useState<Profile|undefined|null>(undefined);
    const forceLoginState = useState<boolean>(true);
    const loadingScreenState = useState<boolean>(false);

    const [profile, setProfile] = profileState;
    const profileContext = useMemo(() => ({
        profile: profileState, forceLogin: forceLoginState
    }), [profileState, forceLoginState]);

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
                    <div className="App brackd-up">
                        <Header/>
                        <main>
                            <Routes>
                                <Route path="/" Component={HomePage}/>
                                <Route path="/tournament" Component={TournamentPage} />
                                {/* <Route path="/tournament/settings" Component={TournamentSettingsPage} />
                                <Route path="/tournament/new" Component={TournamentCreationPage} />
                                <Route path="/admin" Component={AdminPage} /> */}
                            </Routes>
                        </main>
                    </div>
                </LoadingScreenContext.Provider>
            </TournamentManager>
        </ProfileContext.Provider>
    );
}
