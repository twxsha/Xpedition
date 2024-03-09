const WeatherDisplay = ({ weather }) => {
    return (
      <div className="weather-container">
        <div className="weather-item">
          <div className="weather-label">High</div>
          <div className="weather-value">{weather.high}</div>
        </div>
        <div className="weather-item">
          <div className="weather-label">Average</div>
          <div className="weather-value">{weather.average}</div>
        </div>
        <div className="weather-item">
          <div className="weather-label">Low</div>
          <div className="weather-value">{weather.low}</div>
        </div>
      </div>
    );
  };

  export default WeatherDisplay;