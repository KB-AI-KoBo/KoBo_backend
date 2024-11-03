import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../styles/style.css";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="header">
            <div className="logo-icon"></div>
            <div className="coworker-container">
                <b className="coworker">
                    <span className="co">Co.</span>
                    <span className="worker">worker</span>
                </b>
            </div>
            <div className={`login-button ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={handleLoginClick}
            >
                <div className="button-background" >
                    <b className="button-text">

                        로그인
                    </b>
                </div>
            </div>
            <div className={`signin-button ${location.pathname === '/signup' ? 'active' : ''}`}
                onClick={handleSignupClick}
            >
                <div className="button-background" >
                    <b className="button-text">
                        회원가입

                    </b>
                </div>
            </div>
        </div >
    );
};

export default Header;
