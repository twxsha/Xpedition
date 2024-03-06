import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './SignUp.css';
import xpedition from './XPEDITION.png';

const SignUp = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFirstNameChange = (e) => {
        setFirstname(e.target.value);
    };
    const handleLastNameChange = (e) => {
        setLastname(e.target.value);
    };
    const handleContactChange = (e) => {
        setContact(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleLogInClick = () => {
        navigate('/login');
    }
    const handleSignupClick = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, contact, password);
            console.log(userCredential.user)
            navigate('/describe');
        } catch (error) {
            console.error("Error signing up:", error.message)
            if (error.code === 'auth/invalid-email') {
                setErrorMessage('Please provide a valid email.');
            }
            else if (error.code === 'auth/weak-password') {
                setErrorMessage('Password is too short. Minimum length is 6 characters.')
            }
            else if (error.code === 'auth/missing-password') {
                setErrorMessage('Password is missing. Please enter a password.');
            }
            else if (error.code === 'auth/missing-email') {
                setErrorMessage('Email is missing. Please enter an email.');
            }
            else if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('Email already in use.')
            }
             else {
                setErrorMessage('Failed to sign up. Please try again.');
            }
        }
    };
    return (
        <div className="signup">
            <header className="header">
                <img src={xpedition} className="signuplogo" alt="logo" />
                <div className="trect">
                    <p className='signupText'>Sign Up</p>
                    <div className='form'>
                        <div className='names'>
                            <div className='nameInput1'>
                                <input type="text"
                                    id="firstname"
                                    value={firstname}
                                    onChange={handleFirstNameChange}
                                    placeholder='  First Name'
                                    className='inputField'>
                                </input>
                            </div>
                            <div>
                                <input type="text"
                                    id="lastname"
                                    value={lastname}
                                    onChange={handleLastNameChange}
                                    placeholder='  Last Name' >
                                </input>
                            </div> 
                        </div>
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
                        {errorMessage && <div className='errorMessage'>{errorMessage}</div>}
                        <div className='signuppageButton'>
                            <button className='signuppagebutton' onClick={handleSignupClick}> <p>Get Started</p> </button>
                        </div>
                    </div>
                    <button className='signuploginbutton' onClick={handleLogInClick} >Already have an account? <u>Log In</u></button>
                </div>
            </header>
        </div>
    );
};

export default SignUp;