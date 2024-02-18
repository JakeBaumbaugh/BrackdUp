import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import BracketPage from "../bracket/BracketPage";
import { ProfileContext } from "../context/ProfileContext";
import { TournamentContext } from "../context/TournamentContext";
import ListPage from "../list/ListPage";
import Profile from "../model/Profile";
import { Tournament } from "../model/Tournament";
import { checkCookies } from "../service/ProfileService";
import VotePage from "../vote/VotePage";
import Header from "./Header";
import LoginPage from "./LoginPage";
import TournamentCreationPage from "../creation/TournamentCreationPage";
import TournamentSettingsPage from "../settings/TournamentSettingsPage";
import { LoadingScreenContext } from "../context/LoadingScreenContext";
import LoadingScreen from "./LoadingScreen";
import "./App.css";
import "react-datetime/css/react-datetime.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TournamentManager from "../context/TournamentManager";
import AdminPage from "../admin/AdminPage";

function App() {
    const profileState = useState<Profile|undefined|null>(undefined);
    const forceLoginState = useState<boolean>(false);
    const loadingScreenState = useState<boolean>(false);

    const [profile, setProfile] = profileState;
    const profileContext = useMemo(() => ({
        profile: profileState, forceLogin: forceLoginState
    }), [profileState, forceLoginState]);

    useEffect(() => {
        checkCookies()
            .then(profile => setProfile(profile))
            .catch(() => setProfile(null));
    }, []);

    return (
        <ProfileContext.Provider value={profileContext}>
            <TournamentManager>
                <LoadingScreenContext.Provider value={loadingScreenState}>
                    <div className="App">
                        <Header/>
                        <Routes>
                            <Route path="/" Component={ListPage}/>
                            <Route path="/tournament" Component={BracketPage} />
                            <Route path="/tournament/vote" Component={profile ? VotePage : LoginPage} />
                            <Route path="/tournament/settings" Component={TournamentSettingsPage} />
                            <Route path="/tournament/new" Component={TournamentCreationPage} />
                            <Route path="/admin" Component={AdminPage} />
                        </Routes>
                        <LoadingScreen loading={loadingScreenState[0]}/>
                    </div>
                </LoadingScreenContext.Provider>
            </TournamentManager>
        </ProfileContext.Provider>
    );
}

export default App;
