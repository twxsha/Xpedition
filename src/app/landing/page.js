'use client'; 

import React from 'react';
import { useRouter } from 'next/navigation';
import './landing.css';
import xpedition from '@/public/XPEDITION.png';

/**
 * This is the landing page 
 * @returns JSX for the landing page
 */
const Landing = () => {
    const navigate = useRouter();
    const handleSignupClick = () => {
        navigate.push('/signup');
    };
    const handleLogInClick = () => {
        navigate.push('/login');
    };
    return (
        <div className="landing">
            <header className="landingheader">
                <img src={xpedition.src} className="landinglogo" alt="logo" />
                <button className='landingloginbutton' onClick={handleLogInClick}> <p>Log In</p> </button>
                <p className='landingText'>Fastest Travel Planning  <br/> Experience Ever</p>
                <p className='landingSubText'>AI-powered travel tool built for effortless trips. <br/> Save hours of planning.</p>
                <div className='landingbuttons'>
                    <button className='landingsignupbutton' onClick={handleSignupClick}> Get Started </button>
                </div>
            </header>
        </div>
    );
};

export default Landing;