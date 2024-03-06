import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import xpedition from './XPEDITION.png';
import plane from './plane.png';

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
            <header className="landingheader">
                <img src={xpedition} className="landinglogo" alt="logo" />
                {/* <img src={plane} className="airplane" alt="logo" /> */}
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
