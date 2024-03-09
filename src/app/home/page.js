'use client'; 

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import xpedition from '@/public/XPEDITION.png';
import save from '@/public/save.png';
import plus from '@/public/plus.png';
import upload from '@/public/upload.png';
import history from '@/public/history.png';
import {Tooltip} from "@nextui-org/tooltip";
import {Button} from "@nextui-org/button";


import './home.css';
import HotelCard from '../components/HotelCard';

import { getHotelOptions } from '@/endpoints/hotels';

const Home = () => {
    const navigate = useRouter();
    const [input, setInput] = useState('');
    const [flights, setFlights] = useState('');
    const [stay, setStay] = useState('');
    const [weather, setWeather] = useState('');
    const [activities, setActivities] = useState('');
    const [packlist, setPacklist] = useState('');
    const [savePopup, setSavePopup] = useState(false);
    const [sharePopup, setSharePopup] = useState(false);
    const [historyPopup, setHistoryPopup] = useState(false);
    const [XpeditionName, setXpeditionName] = useState('');
    const [XpeditionLink, setXpeditionLink] = useState('');
    const [History, setHistory] = useState('');
    const popupRef = useRef(null);
    
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
    const handlePlusClick = () => {
        navigate.push('/describe');
    };
    const handleNameChange = (e) => {
        setXpeditionName(e.target.value);
    }
    const handleSaveClick = () => {
        setSavePopup(true);
    };
    const handleShareClick = () => {
        setSharePopup(true);
    };
    const handleHistoryClick = () => {
        setHistoryPopup(true);
    };
    const handleXclick = (e) => {
        setSavePopup(false);
        setSharePopup(false);
        setHistoryPopup(false);
    }
    useEffect(() => {
        // Fetch the initial hotel options when the component mounts
        const fetchHotels = async () => {
          const res = await getHotelOptions();
          setStay(res);
        };
    
        fetchHotels();
    }, []);
    return (
        <div className="home">
            <header className="homeheader">
                <div className='navbar'>
                    <img src={xpedition.src} className="home_logo" alt="logo" />
                    <div className="navbuttons">
                        <Tooltip showArrow={true} className="custom-tooltip" content="Save Xpedition" placement="bottom">
                            <Button onClick={handleSaveClick}><img src={save.src} className="save" alt="logo" /></Button>
                        </Tooltip>
                        <Tooltip showArrow={true} className="custom-tooltip" content="New Xpedition">
                            <Button onClick={handlePlusClick}><img src={plus.src} className="plus" alt="logo" /></Button>
                        </Tooltip>
                        <Tooltip showArrow={true} className="custom-tooltip" content="History">
                            <Button onClick={handleHistoryClick}><img src={history.src} className="history" alt="logo" /></Button>
                        </Tooltip>
                        <Tooltip showArrow={true} className="custom-tooltip" content="Share Expedition">
                            <Button onClick={handleShareClick}> <img src={upload.src} className="upload" alt="logo" /></Button>
                        </Tooltip>
                    </div> 
                </div>
                { savePopup && <div className='saveBox'>
                    <button onClick={handleXclick} className='x-button'>x</button>
                    <label className="save-label"> Enter Xpedition Name: </label>
                    <div className="description-group">
                        <input
                            type="text"
                            value={XpeditionName}
                            onChange={handleNameChange}
                            className="save-description"
                        />
                        <button className='save-button'>Save</button>
                    </div>
                </div> }
                { sharePopup && <div className='saveBox'>
                    <button onClick={handleXclick} className='x-button'>x</button>
                    <label className="save-label"> Share Xpedition: </label>
                    <div className="description-group">
                        <input
                            type="text"
                            value={XpeditionLink}
                            onChange={handleNameChange}
                            className="save-description"
                            readOnly={true}
                        />
                    </div>
                </div> }
                { historyPopup && <div className='saveBox'>
                    <button onClick={handleXclick} className='x-button'>x</button>
                    <label className="save-label"> History </label>
                    <div className="description-group">
                        <input
                            type="text"
                            value={History}
                            onChange={handleNameChange}
                            className="save-description"
                            readOnly={true}
                        />
                    </div>
                </div> }
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
                            <div className="hotel-cards-container">
                                {stay && stay.length > 0 ? (
                                    stay.map((hotel, index) => (
                                    <HotelCard key={index} hotel={hotel} />
                                    ))
                                ) : (
                                    <p>Loading hotels...</p>
                                )}
                            </div>
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