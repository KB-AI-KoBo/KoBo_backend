import React from 'react';
import ReactDOM from 'react-dom/client';
import 'dotenv/config';
import App from './App';
import './styles/style.css';
import './styles/signup.css';
import './styles/showP.css';
import './styles/chat.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
