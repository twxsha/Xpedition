'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase-config';
import './describe.css';
import xpedition from '@/public/XPEDITION.png';

const Describe = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Redirect to login if user is not authenticated
        if (!user && !loading) {
            navigate.push("/login");
        }
    }, [user, loading, navigate]);

    const [description, setDescription] = useState('');

    const handleInputChange = (event) => {
        setDescription(event.target.value);
    };

    const handleGoClick = () => {
        sessionStorage.setItem('description', description);
        navigate.push('/home');
    };

    return (
        <div className="describe">
        { !loading && (
                <header className="describeheader">
                    <img src={xpedition.src} className="describelogo" alt="logo" />
                    <p className='describeText'>Describe Your Xpedition</p>
                    <p className='describeSubText'>Tell us your starting point and describe your trip</p>
                    <input type="text" id="describeInput" value={description} 
                    placeholder='Tell us your ideal location, dates, number of people or any other information to help us  provide our best recommendations' onChange={handleInputChange}></input>
                    <div className='describebuttons'>
                        <button className='describesignupbutton' onClick={handleGoClick}> Go </button>
                    </div>
                </header>
            
        ) }
        { loading && (
            <div className="describe">
                <header className="describeheader">
                    <img src={xpedition.src} className="describelogo" alt="logo" />
                    <p className='describeText'>Loading...</p>
                </header>
            </div>
        )}
        </div>
    );
    
};

export default Describe;
