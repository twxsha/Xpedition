'use client'; 

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './xpedition.css';
import { doc, collection, setDoc, getDocs, getDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase-config";
import xpedition from '@/public/XPEDITION.png';
import HotelCard from '../../../components/HotelCard';
import FlightCard from '../../../components/FlightCard';
import WeatherDisplay from '../../../components/WeatherCard';

/**
 * This is an alternative version of the home page used to view Xpeditions that were previously saved
 * @param {*} params the ids to find the saved xpedition, come from the URL path (uid, eventid)
 * @returns JSX for alternative home page (when viewing a saved xpedition)
 */
const Home = ({ params }) => {
    const navigate = useRouter();
    const [input, setInput] = useState('');
    const [flights, setFlights] = useState('');
    const [stay, setStay] = useState('');
    const [weather, setWeather] = useState('');
    const [activities, setActivities] = useState('');
    const [packlist, setPacklist] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchEventByUID = async () => {
            const eventRef = doc(db, "xpeditions", params.uid, "events", params.eventid);
            const eventDoc = await getDoc(eventRef);
            if (eventDoc.exists()) {
                console.log("Document exists:", eventDoc.data());
                let data = eventDoc.data();
                setStay(data.hotels);
                setFlights(data.flights);
                setWeather(data.weather);
                setPacklist(data.packing);
                setActivities(data.activities);
                setInput(data.name);
                setLoading(false);
              } else {
                console.log("Document doesn't exist");
                return null;
              }
        }
        fetchEventByUID();
      }, []);

    if(loading) {
        return (
            <div className="home">
                <header className="homeheader">
                    <div className='navbar'>
                        <img src={xpedition.src} className="home_logo" alt="logo" />
                    </div>
                </header>
                <div>
                    <p className='loadingText'>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home">
        <header className="homeheader">
            <div className='navbar'>
                <img src={xpedition.src} className="home_logo" alt="logo" />
               
            </div>
            <main className="main-content">
                <div className="row">
                    <div className="input-group">
                        <label className="input-label">Flights</label>
                        <div className="flight-cards-container">
                            {flights && flights.length > 0 ? (
                                flights.map((flight, index) => (
                                    <FlightCard key={index} flight={flight} />
                                ))
                            ) : (
                                <p> Loading Flights...</p>
                            )}
                        </div>
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