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
import FlightCard from '../components/FlightCard';
import WeatherDisplay from '../components/WeatherCard';

import { getHotelOptions } from '@/endpoints/hotels';
import { getPackingList } from '@/endpoints/packing';
import { getActivitiesList } from '@/endpoints/activities';
import { getWeather } from '@/endpoints/weather';
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState hook
import { getFlightOptions } from '@/endpoints/flights';


const Home = () => {
    const navigate = useRouter();
    const [user] = useAuthState(auth); // Get current user
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
    const [backendLoading, setBackendLoading] = useState(true);
    const [loadingText, setLoadingText] = useState('Creating your Xpedition');
    const loadingMessages = ['Contacting the Flights Wizard', 'Chatting with Dr. Hotel', 'Generating Packing List', 'Asking god for the Weather'];
    const [messageIndex, setMessageIndex] = useState(0);
    
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
                id: XpeditionName,
                name: input,
                //hotels: stay,
                flights: flights,
                activities: activities,
                packing: packlist, 
                weather: weather
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
        // go to database and get history
        // [domain].com/xpeditions/user/eventid
        let userid = auth.currentUser.uid;
        const fetchEventByUID = async () => {
            const eventsRef = collection(db, "xpeditions", userid, "events");
            const eventsSnapshot = await getDocs(eventsRef);

            const eventsData = [];
            eventsSnapshot.forEach((doc) => {
            if (doc.exists()) {
                console.log("Document exists:", doc.id, doc.data());
                let data = doc.data();
                eventsData.push([
                    data.id,
                    "/xpeditions/" + userid + "/" + doc.id
                ]);
            } else {
                console.log("Document doesn't exist");
            }
            setHistory(eventsData);
            console.log(eventsData);
            });
        }
        fetchEventByUID();
        setHistoryPopup(true);
    };
    const handleXclick = (e) => {
        setSavePopup(false);
        setSharePopup(false);
        setHistoryPopup(false);
    }

    useEffect(() => {
        const storedDescription = sessionStorage.getItem('description');
        if (storedDescription) {
          setInput(storedDescription);
        } else {
          navigate.push('/describe');
        }
      }, [navigate]);
    
      useEffect(() => {
        const fetchData = async () => {
          if (input) {
            try {
              const results = await Promise.all([
                getHotelOptions(input),
                getFlightOptions(input),
                getPackingList(input),
                getActivitiesList(input),
                getWeather(input),
              ]);
      
              const [hotelsRes, flightsRes, packingListRes, activitiesListRes, weatherRes] = results;
      
              setStay(hotelsRes);
              setFlights(flightsRes);
              setPacklist(packingListRes.packing_list);
              setActivities(activitiesListRes.activities_list);
              setWeather(weatherRes);
              setBackendLoading(false);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }
        };
    
        fetchData();
      }, [input]);

    
    useEffect(() => {
        if (backendLoading) {
          setLoadingText(loadingMessages[messageIndex]);
        }
      }, [backendLoading, messageIndex]);
  
    useEffect(() => {
    let intervalId;
    if (backendLoading) {
        intervalId = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 1000);
    }

    return () => clearInterval(intervalId);
    }, [backendLoading, loadingMessages.length]);


    useEffect(() => {
        // Redirect to login if user is not authenticated
        if (!user) {
            navigate.push("/login");
        }
    }, [user, navigate]);

    if(backendLoading) {
        return (
            <div className="home">
                <header className="homeheader">
                    <div className='navbar'>
                        <img src={xpedition.src} className="home_logo" alt="logo" />
                    </div>
                </header>
                <div>
                    <p className='loadingText'> {loadingText} </p>
                </div>
            </div>
        );
    }

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
                {historyPopup && (
                    <div className='saveBox'>
                        <button onClick={handleXclick} className='x-button'>x</button>
                        <label className="save-label">History</label>
                        <div className="history-name">
                        {History && History.map((obj) => (
                            <div key={obj[0]}>
                                <a href={obj[1]} target="_blank" rel="noopener noreferrer">
                                    {obj[0]}
                                </a>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}

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