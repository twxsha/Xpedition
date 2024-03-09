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
import WeatherDisplay from '../components/WeatherCard';

import { getHotelOptions } from '@/endpoints/hotels';
import { getPackingList } from '@/endpoints/packing';
import { getActivitiesList } from '@/endpoints/activities';
import { getWeather } from '@/endpoints/weather';
import { doc, collection, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";


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

    const handleSavePopupClick = async () => {
        try {
            //console.log(auth.currentUser.email);
            if(!auth.currentUser) {
                navigate.push("/login");
            }
            // Create a reference to the user's document under the "Xpeditions" collection
            const userDocRef = doc(db, "xpeditions", auth.currentUser.uid);
            // Create a reference to a new collection within the user's document
            const subCollectionRef = collection(userDocRef, "events"); // Replace "newCollectionName" with your desired collection name
        
            // Add a document to the new collection
            await setDoc(doc(subCollectionRef), {
                name: "this is a placeholder name",
                hotels: stay,
                flights: "Lovelace",
                activities: 1815,
                packing: "",
                weather: "weathers"
            });
        
            console.log("Document added to subcollection successfully!");
        } catch (error) {
            console.error("Error adding document to subcollection:", error);
        }
        setSavePopup(false);
        setXpeditionName('');
        console.log("hi")
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
        // Wrap all fetch calls in a single async function
        const fetchData = async () => {
            // Use Promise.all to run fetch functions in parallel
            const results = await Promise.all([
                getHotelOptions(),
                getPackingList(),
                getActivitiesList(),
                getWeather(),
            ]);
    
            // Destructure the results array to get individual responses
            const [hotelsRes, packingListRes, activitiesListRes, weatherRes] = results;
    
            // Update state for each response
            setStay(hotelsRes);
            setPacklist(packingListRes.packing_list);
            setActivities(activitiesListRes.activities_list);
            setWeather(weatherRes);
        };
    
        fetchData();
    
    }, []);
    
    return (
        <div className="home">
            <header className="homeheader">
                <div className='navbar'>
                    <img src={xpedition.src} className="home_logo" alt="logo" />
                    <div>
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
                        <button onClick={handleSavePopupClick} className='save-button'>Save</button>
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
                                    <p> Loading hotels...</p>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="input-group">
                            <label className="input-label">Weather</label>
                            <WeatherDisplay weather={weather} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Activities</label>
                            <div className="activities-container">
                                {activities && activities.length > 0 ? (
                                    activities.map((item, index) => (
                                        <div key={index} className="activities-item">
                                            {item}
                                        </div>
                                    ))
                                ) : (
                                    <p> Loading activities...</p>
                                )}
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Packing List</label>
                            <div className="packing-list-container">
                                {packlist && packlist.length > 0 ? (
                                    packlist.map((item, index) => (
                                        <div key={index} className="packing-list-item">
                                            {item}
                                        </div>
                                    ))
                                ) : (
                                    <p>Loading list...</p>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </header>
        </div>
    );
};

export default Home;