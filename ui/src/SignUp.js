import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import xpedition from './XPEDITION.png';

const SignUp = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');

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
    const handleSignupClick = () => {
        // signup logic
        navigate('/describe');
    };
    const handleLogInClick = () => {
        navigate('/login');
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