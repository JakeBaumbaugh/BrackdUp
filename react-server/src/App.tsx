import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import BracketPage from './bracket/BracketPage';
import ListPage from './list/ListPage';

function App() {
    return (
        <div className="App">
            <header>
                <span>Music Madness</span>
                <button>Vote Now</button>
            </header>
            <BrowserRouter>
                <Routes>
                    <Route path="/" Component={ListPage}/>
                    <Route path="/tournament" Component={BracketPage} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
