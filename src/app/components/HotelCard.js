import React from 'react';
import styles from './HotelCard.module.css';
import Link from 'next/link';
/**
 * The hotel card component displays all the information for one stay option
 * @param {*} hotel all the data for one hotel 
 * @returns JSX for one hotel card
 */
const HotelCard = ({ hotel }) => {
  return (
    <Link href={hotel.link} target='blank'>
        <div className={styles.card}>
        <div className={styles.imageWrapper}>
            <img src={hotel.thumbnail} alt={hotel.name} className={styles.image} />
        </div>
        <div className={styles.details}>
            <h3 className={styles.name}>{hotel.name}</h3>
            <div className={styles.price}>{`${hotel.price}`}</div>
            <div className={styles.amenities}>
            {hotel.amenities.map((amenity, index) => (
                <span key={index} className={styles.amenity}>{amenity}</span>
            ))}
            </div>
            <div className={styles.rating}>{hotel.rating}</div>
        </div>
        </div>
    </Link>
  );
};

export default HotelCard;
