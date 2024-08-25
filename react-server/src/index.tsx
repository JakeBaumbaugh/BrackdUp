import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import App2 from './brackd-up/app/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const brackdUp = true;

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <GoogleOAuthProvider clientId="809997101751-gca7bdfjfc8a7c3cftr6bqij1g3hdf5f.apps.googleusercontent.com">
        <React.StrictMode>
            <BrowserRouter>
                {brackdUp ? <App2/> : <App/>}
            </BrowserRouter>
        </React.StrictMode>
    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

setVh();
window.addEventListener("resize", setVh);