import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './styles/style.css';
import Login from './pages/Login';
import Signup from './pages/Signup';

function PrivateHome() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/*" element={
                    <div className="app">
                        <Header />
                        <div className="content-wrapper-container">
                            <div className={`content-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                                <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                                <MainContent />
                            </div>
                        </div>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default PrivateHome;