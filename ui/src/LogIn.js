import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './LogIn.css';
import xpedition from './XPEDITION.png';

const LogIn = () => {
    const navigate = useNavigate();
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleContactChange = (e) => {
        setContact(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleLogInClick = async () => {
        try {
            await signInWithEmailAndPassword(auth, contact, password);
            navigate('/describe');
        } catch (error) {
            console.error("Error Logging In:", error.message);
            if (error.code === 'auth/invalid-credential') {
                setErrorMessage('Email or password is incorrect.');
            } 
            else if (error.code === 'auth/invalid-email') {
                setErrorMessage('Please provide a valid email.');
            } 
            else if (error.code === 'auth/missing-password') {
                setErrorMessage('Password is missing. Please enter a password.');
            } else {
                setErrorMessage('Failed to login. Please try again.');
            }
        }
    };
    const handleSignUpClick = () => {
        navigate('/signup');
    };
    return (
        <div className="login">
            <header className="loginheader">
                <img src={xpedition} className="loginlogo" alt="logo" />
                <div className="logintrect">
                    <p className='loginText'>Log In</p>
                    <div className='loginform'>
                        <div className='contactInput'>
                            <input type="text"
                                id="contact"
                                value={contact}
                                onChange={handleContactChange}
                                placeholder=' Email ' >
                            </input>
                        </div>
                        <div className='passwordInput'>
                            <input type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder='  Password' >
                            </input>
                        </div>
                        {errorMessage && <div className='errorMessage'>{errorMessage}</div>}
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