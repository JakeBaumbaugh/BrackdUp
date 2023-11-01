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
import "./App.css";
import "react-datetime/css/react-datetime.css";
import TournamentSettingsPage from "../settings/TournamentSettingsPage";

function App() {
    const tournamentState = useState<Tournament|null>();
    const profileState = useState<Profile|undefined|null>(undefined);
    const useOneTapState = useState<boolean>(false);
    const [profile, setProfile] = profileState;

    useEffect(() => {
        checkCookies()
            .then(profile => setProfile(profile))
            .catch(() => setProfile(null));
    }, []);

    const profileContext = useMemo(() => ({
        profile: profileState, useOneTap: useOneTapState
    }), [profileState, useOneTapState]);

    return (
        <ProfileContext.Provider value={profileContext}>
            <TournamentContext.Provider value={tournamentState}>
                <div className="App">
                    <Header/>
                    <Routes>
                        <Route path="/" Component={ListPage}/>
                        <Route path="/tournament" Component={BracketPage} />
                        <Route path="/tournament/vote" Component={profile ? VotePage : LoginPage} />
                        <Route path="/tournament/settings" Component={TournamentSettingsPage} />
                        <Route path="/tournament/new" Component={TournamentCreationPage} />
                    </Routes>
                </div>
            </TournamentContext.Provider>
        </ProfileContext.Provider>
    );
}

export default App;
