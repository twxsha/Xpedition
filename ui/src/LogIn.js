import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';
import xpedition from './XPEDITION.png';

const LogIn = () => {
    const navigate = useNavigate();
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');

    const handleContactChange = (e) => {
        setContact(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleLogInClick = () => {
        navigate('/describe');
    };
    const handleSignUpClick = () => {
        // signup logic
        navigate('/signup');
    };
    return (
        <div className="login">
            <header className="loginheader">
                <img src={xpedition} className="loginlogo" alt="logo" />
                <div className="trect">
                    <p className='loginText'>Log In</p>
                    <div className='loginform'>
                        <div className='contactInput'>
                            <input type="text"
                                id="contact"
                                value={contact}
                                onChange={handleContactChange}
                                placeholder=' Mobile Number or Email ' >
                            </input>
                        </div>
                        <div className='passwordInput'>
                            <input type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder='  New Password' >
                            </input>
                        </div>
                        <div className='loginpageButton'>
                            <button className='loginpagebutton' onClick={handleLogInClick}> <p>Get Started</p> </button>
                        </div>
                    </div>
                    <button className='loginsignupbutton' onClick={handleSignUpClick} >Don't have an account? <u>Sign Up</u></button>
                </div>
            </header>
        </div>
    );
};

export default LogIn;