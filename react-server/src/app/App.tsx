import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import BracketPage from '../bracket/BracketPage';
import { TournamentContext } from '../context/TournamentContext';
import ListPage from '../list/ListPage';
import { Tournament } from '../model/Tournament';
import './App.css';
import Header from './Header';

function App() {
    const tournamentState = useState<Tournament|null>();

    return (
        <TournamentContext.Provider value={tournamentState}>
            <div className="App">
                <Header/>
                <Routes>
                    <Route path="/" Component={ListPage}/>
                    <Route path="/tournament" Component={BracketPage} />
                </Routes>
            </div>
        </TournamentContext.Provider>
    );
}

export default App;
