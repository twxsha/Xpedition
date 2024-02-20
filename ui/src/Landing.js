import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const handleSignupClick = () => {
        navigate('/signup');
    };
    const handleLogInClick = () => {
        navigate('/login');
    };
    return (
        <div className="landing">
            <header className="header">
                <img src={logo} className="flex items-center justify-center mb-40" alt="logo" />
                <div className='buttons'>
                    <button className='signupbutton' onClick={handleSignupClick}> <p>Sign Up</p> </button>
                    <button className='loginbutton' onClick={handleLogInClick}> <p>Log In</p> </button>
                </div>
            </header>
        </div>
    );
};

export default Landing;
