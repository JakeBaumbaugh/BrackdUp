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

function App() {
    const tournamentState = useState<Tournament|null>();
    const profileState = useState<Profile>();

    return (
        <ProfileContext.Provider value={profileState}>
            <TournamentContext.Provider value={tournamentState}>
                <div className="App">
                    <Header/>
                    <Routes>
                        <Route path="/" Component={ListPage}/>
                        <Route path="/tournament" Component={BracketPage} />
                        <Route path="/tournament/vote" Component={VotePage} />
                    </Routes>
                </div>
            </TournamentContext.Provider>
        </ProfileContext.Provider>
    );
}

export default App;
