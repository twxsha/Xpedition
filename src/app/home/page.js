'use client';

import React, { useState } from 'react';
import logo from './logo.png';
import './Home.css';
import { useRouter } from 'next/navigation';

const Page = () => {
    const navigate = useRouter();
    const [input, setInput] = useState('');
    const [flights, setFlights] = useState('');
    const [stay, setStay] = useState('');
    const [weather, setWeather] = useState('');
    const [activities, setActivities] = useState('');
    const [packlist, setPacklist] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };
    const handleflightsChange = (e) => {
        setFlights(e.target.value);
    };
    const handleStayChange = (e) => {
        setStay(e.target.value);
    };
    const handleWeatherChange = (e) => {
        setWeather(e.target.value);
    };
    const handleActivitiesClick = (e) => {
        setActivities(e.target.value);
    };
    const handlePacklistClick = (e) => {
        setPacklist(e.target.value);
    };
    return (
        <div className="home">
            <header className="header">
                <div className='form'>
                    <div className='logo'>
                        <img src={logo} alt="logo" />
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Page;