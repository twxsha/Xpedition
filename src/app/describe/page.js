'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SerpCallout from '../components/serp_callout/serp_callout.js';
import './describe.css';
import xpedition from '@/public/XPEDITION.png';

const Describe = () => {
    const navigate = useRouter();
    const [description, setDescription] = useState('');

    const handleInputChange = (event) => {
        setDescription(event.target.value);
    };

    const handleGoClick = () => {
        navigate.push('/home');
    };

    return (
        <div className="describe">
            <SerpCallout/>
            <header className="describeheader">
                <img src={xpedition.src} className="describelogo" alt="logo" />
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