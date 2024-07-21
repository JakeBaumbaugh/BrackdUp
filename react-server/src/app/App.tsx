import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useMemo, useState } from "react";
import "react-datetime/css/react-datetime.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Route, Routes } from "react-router-dom";
import AdminPage from "../admin/AdminPage";
import BracketPage from "../bracket/BracketPage";
import { LoadingScreenContext } from "../context/LoadingScreenContext";
import { ProfileContext } from "../context/ProfileContext";
import TournamentManager from "../context/TournamentManager";
import TournamentCreationPage from "../creation/TournamentCreationPage";
import ListPage from "../list/ListPage";
import Profile from "../model/Profile";
import { checkCookies } from "../service/ProfileService";
import TournamentSettingsPage from "../settings/TournamentSettingsPage";
import VotePage from "../vote/VotePage";
import "./App.css";
import Header from "./Header";
import LoadingScreen from "./LoadingScreen";
import LoginPage from "./LoginPage";

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
        <DndProvider backend={HTML5Backend}>
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
        </DndProvider>
    );
}

export default App;
