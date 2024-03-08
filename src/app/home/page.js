'use client'; 

import React, { useState } from 'react';
import xpedition from '@/public/XPEDITION.png';
import './Home.css';

const Home = () => {
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

    const handleRunClick = () => {
        // Implement the logic for when the run button is clicked
        // You might want to navigate to another page with the data or send it to an API
        console.log('Running with the following details:', { input, flights, stay, weather, activities, packlist });
        // navigate('/some-result-page');
    };

    return (
        <div className="home">
            <header className="homeheader">
                <img src={xpedition.src} className="home_logo" alt="logo" />
                <label className="top-label"> Your Xpedition </label>
                <div className="description-group">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        className="input-description"
                        readOnly={true}
                    />
                </div>

                <main className="main-content">
                    <div className="row">
                        <div className="input-group">
                            <label className="input-label">Flights</label>
                            <textarea
                                className="input-large"
                                value={flights}
                                onChange={handleflightsChange}
                                placeholder="..."
                                readOnly={true}
                            ></textarea>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Stays</label>
                            <textarea
                                className="input-large"
                                value={stay}
                                onChange={handleStayChange}
                                placeholder="..."
                                readOnly={true}
                            ></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-group">
                            <label className="input-label">Weather</label>
                            <textarea
                                className="input-small"
                                value={weather}
                                onChange={handleWeatherChange}
                                placeholder="..."
                                readOnly={true}
                            ></textarea>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Activities</label>
                            <textarea
                                className="input-small"
                                value={activities}
                                onChange={handleActivitiesClick}
                                placeholder="..."
                                readOnly={true}
                            ></textarea>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Packing List</label>
                            <textarea
                                className="input-small"
                                value={packlist}
                                onChange={handlePacklistClick}
                                placeholder="..."
                                readOnly={true}
                            ></textarea>
                        </div>
                    </div>
                </main>
            </header>
        </div>
    );
};

export default Home;