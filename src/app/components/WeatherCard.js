const WeatherDisplay = ({ weather }) => {
    if (!weather) return <div className="weather-container">Loading weather...</div>;
  
    return (
      <div className="weather-container">
        <div className="weather-card high">
          <div className="weather-icon">🌞</div>
          <div className="weather-info">
            <div className="weather-label">High</div>
            <div className="weather-value">{weather.high}</div>
          </div>
        </div>
        <div className="weather-card average">
          <div className="weather-icon">⛅️</div>
          <div className="weather-info">
            <div className="weather-label">Average</div>
            <div className="weather-value">{weather.average}</div>
          </div>
        </div>
        <div className="weather-card low">
          <div className="weather-icon">🌜</div>
          <div className="weather-info">
            <div className="weather-label">Low</div>
            <div className="weather-value">{weather.low}</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default WeatherDisplay;