import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import logo from './logo.png';
import './SignUp.css';

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
    const handleSignupClick = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, contact, password);
            console.log(userCredential.user)
            navigate('/login');
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
             else {
                setErrorMessage('Failed to login. Please try again.');
            }
        }
    };
    return (
        <div className="signup">
            <header className="header">
                <div className='form'>
                    <div className='logo'>
                        <img src={logo} alt="logo" />
                    </div>
                    <div className='names'>
                        <div className='nameInput1'>
                            <input type="text"
                                id="firstname"
                                value={firstname}
                                onChange={handleFirstNameChange} 
                                placeholder='  First Name'> 
                            </input>
                        </div>
                        <div className='nameInput2'>
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
                            placeholder='  Email' > 
                        </input>
                    </div>
                    <div className='passwordInput'>
                        <input type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange} 
                            placeholder='  Create a Password' > 
                        </input>
                    </div>
                    {errorMessage && <div className='errorMessage'>{errorMessage}</div>}
                    <div className='signupButton'>
                        <button className='signupbutton' onClick={handleSignupClick}> <p>Sign Up</p> </button>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default SignUp;