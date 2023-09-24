import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import BracketPage from './pages/BracketPage';

function App() {
    return (
        <div className="App">
            <header>
                <span>Music Madness</span>
                <button>Vote Now</button>
            </header>
            <BrowserRouter>
                <Routes>
                    <Route path="/" />
                    <Route path="/tournament" Component={BracketPage} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
