import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import './LogIn.css';

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
        // log in logic
        navigate('/');
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
                            placeholder='  Email or Phone #' > 
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
                    <div className='signupButton'>
                        <button className='signupbutton' onClick={handleLogInClick}> <p>Log In</p> </button>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default LogIn;