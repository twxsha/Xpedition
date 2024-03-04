import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import logo from './logo.png';
import './LogIn.css';

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
            navigate('/X');
        } catch (error) {
            console.error("Error signing in:", error.message);
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
    return (
        <div className="login">
            <header className="header">
                <div className='form'>
                    <div className='logo'>
                        <img src={logo} alt="logo" />
                    </div>
                    <div className='contactInput'>
                        <input type="text"
                            id="contact"
                            value={contact}
                            onChange={handleContactChange} 
                            placeholder='  Email' > 
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
                    <div className='signupButton'>
                        <button className='signupbutton' onClick={handleLogInClick}> <p>Log In</p> </button>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default LogIn;