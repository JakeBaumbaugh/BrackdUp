import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import BracketPage from '../bracket/BracketPage';
import { ProfileContext } from '../context/ProfileContext';
import { TournamentContext } from '../context/TournamentContext';
import ListPage from '../list/ListPage';
import Profile from '../model/Profile';
import { Tournament } from '../model/Tournament';
import './App.css';
import Header from './Header';
import VotePage from '../vote/VotePage';
import LoginPage from './LoginPage';

function App() {
    const tournamentState = useState<Tournament|null>();
    const profileState = useState<Profile>();
    const useOneTapState = useState<boolean>(false);
    const [profile] = profileState;

    return (
        <ProfileContext.Provider value={{profile: profileState, useOneTap: useOneTapState}}>
            <TournamentContext.Provider value={tournamentState}>
                <div className="App">
                    <Header/>
                    <Routes>
                        <Route path="/" Component={ListPage}/>
                        <Route path="/tournament" Component={BracketPage} />
                        <Route path="/tournament/vote" Component={profile?.jwt ? VotePage : LoginPage} />
                    </Routes>
                </div>
            </TournamentContext.Provider>
        </ProfileContext.Provider>
    );
}

export default App;
