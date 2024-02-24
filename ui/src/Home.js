import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
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
        <header className="header">
            <img src={logo} alt="logo" className="logo" />
            <div className="description">
                <div className="input-group">
                    <label className="input-label">Describe Your Vacation</label>
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Tell us details that will help us plan! For example, city you are starting from, place you want to go, dates you want to visit, number of people, etc..."
                        className="input-description"
                    />
                </div>

                <button onClick={handleRunClick} className="run-button">Run</button>
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
                    ></textarea>
                </div>
                <div className="input-group">
                    <label className="input-label">Stays</label>
                    <textarea
                        className="input-large"
                        value={stay}
                        onChange={handleStayChange}
                        placeholder="..."
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
                    ></textarea>
                </div>
                <div className="input-group">
                    <label className="input-label">Activities</label>
                    <textarea
                        className="input-small"
                        value={activities}
                        onChange={handleActivitiesClick}
                        placeholder="..."
                    ></textarea>
                </div>
                <div className="input-group">
                    <label className="input-label">Packing List</label>
                    <textarea
                        className="input-small"
                        value={packlist}
                        onChange={handlePacklistClick}
                        placeholder="..."
                    ></textarea>
                </div>
            </div>
        </main>
        </header>
    </div>
);
};

export default Home;