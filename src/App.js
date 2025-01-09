import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/style.css';

import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicHome from './pages/PublicHome';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="app">
                {/* 항상 표시될 Header */}
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    {/* 기본 경로("/")에 Home 컴포넌트 표시 */}
                    <Route path="/" element={<PublicHome />} />
                </Routes>

            </div>
        </Router>
    );
}

export default App;
