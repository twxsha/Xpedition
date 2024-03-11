import React, { useEffect } from 'react';
import styles from './FlightCard.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { format } from 'path';


function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const FlightCard = ({ flight }) => {
  const options = {  month: 'short', day: 'numeric' };

  let [departureDateString, updateDepartureDateString] = useState('');
  let [arrivalDateString, updateArrivalDateString] = useState('');
  let [arrivalTime, updateArrivalTime] = useState('');
  let [departureTime, updateDepartureTime] = useState('');
  useEffect(() => {
    let d = new Date(flight.departure_time)
    updateDepartureDateString(d.toLocaleDateString("en-us", options))
    updateDepartureTime(formatAMPM(d))
  }, [flight.departure_time]);

  useEffect(() => {
    let d = new Date(flight.arrival_time)
    updateArrivalDateString(d.toLocaleDateString("en-us", options))
    updateArrivalTime(formatAMPM(d))
  }, [flight.departure_time]);



  return (
    <Link href={flight.link} target='blank'>
        <div className={styles.card}>
        <div className={styles.imageWrapper}>
            <img src={flight.airline_logo} alt={flight.airline} className={styles.image} />
        </div>
        <div className = {styles.details}>
          <div className={styles.title2}>{departureDateString  + " - " + arrivalDateString}</div>
          <div className={styles.subtitle}>{departureTime + " - " + arrivalTime}</div>
        </div>
        <div className = {styles.details}>
          <div className={styles.title}>{flight.airline}</div>
          <div className={styles.subtitle}>{flight.departure_code + "-" + flight.arrival_code}</div>   
        </div>
        <div className = {styles.details}>
          <div className={styles.title}>{flight.num_stops > 1 ? flight.num_stops + " stops" : flight.num_stops > 0 ? flight.num_stops + " stop" : "Nonstop"}</div>
          <div className={styles.subtitle}>{Math.floor(flight.total_duration / 60) + " hr " + flight.total_duration % 60 + " min"}</div>
        </div>
        <div className = {styles.details}>
          <div className={styles.price}>{"$"+flight.price}</div>
          <div className = {styles.subtitle}>{flight.type}</div>
        </div>
 
        </div>

    </Link>
  );
};

export default FlightCard;
