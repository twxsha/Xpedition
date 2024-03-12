'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './login.css';
import xpedition from '@/public/XPEDITION.png';

const LogIn = () => {
    const navigate = useRouter();
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Redirect to login if user is not authenticated
        if (user && !loading) {
            navigate.push("/describe");
        }
    }, [user, loading, navigate]);



    const handleContactChange = (e) => {
        setContact(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleLogInClick = async () => {
        try {
            await signInWithEmailAndPassword(auth, contact, password);
            navigate.push('/describe');
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
        navigate.push('/signup');
    };
    return (
        <div className="login">
            <header className="loginheader">
                <img src={xpedition.src} className="loginlogo" alt="logo" />
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