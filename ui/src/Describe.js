import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Describe.css';
import xpedition from './XPEDITION.png';

const Describe = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');

    const handleInputChange = (event) => {
        setDescription(event.target.value);
    };

    const handleGoClick = () => {
        navigate('/X');
    };

    return (
        <div className="describe">
            <header className="describeheader">
                <img src={xpedition} className="describelogo" alt="logo" />
                <p className='describeText'>Describe Your Xpedition</p>
                <p className='describeSubText'>Tell us your starting point and describe your trip</p>
                <input type="text" id="describeInput" value={description} onChange={handleInputChange}></input>
                <div className='describebuttons'>
                    <button className='describesignupbutton' onClick={handleGoClick}> Go </button>
                </div>
            </header>
        </div>
    );
};

export default Describe;
