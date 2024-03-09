'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase-config';
import './describe.css';
import xpedition from '@/public/XPEDITION.png';

const Describe = () => {

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              // ...
              console.log("uid", uid)
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
            }
          });
         
    }, [])


    const navigate = useRouter();
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