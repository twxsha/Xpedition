'use client'; 

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import xpedition from '@/public/XPEDITION.png';
import save from '@/public/save.png';
import plus from '@/public/plus.png';
import upload from '@/public/upload.png';
import history from '@/public/history.png';
import './home.css';
import HotelCard from '../components/HotelCard';
import { doc, collection, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { getHotelOptions } from '@/endpoints/hotels';

const Home = () => {
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

    const handleSaveClick = async () => {

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
                        <button onClick={handleSaveClick}><img src={save.src} className="save" alt="logo" /> </button>
                        <button onClick={handlePlusClick}><img src={plus.src} className="plus" alt="logo" /> </button>
                        <img src={history.src} className="history" alt="logo" />
                        <img src={upload.src} className="upload" alt="logo" />
                    </div> 
                </div>
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