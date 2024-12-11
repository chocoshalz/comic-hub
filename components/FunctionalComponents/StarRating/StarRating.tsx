import React, { useEffect, useState } from 'react';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  value?: number;
  fontSize?: number; // Controls the font size of the stars
  editable?: boolean; // Determines if the stars are editable
  onChange?: (value: number) => void; // Optional for non-editable stars
}

const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  fontSize = 16,
  editable = true,
  onChange,
}) => {
  const [rating, setRating] = useState(value);
  console.log("value => ", value, rating)

  useEffect(()=>{
    if(!editable){setRating(value)}
    if(value === 0){setRating(value)}
  })

  const handleClick = (starValue: number) => {
    if (!editable || !onChange) return;
    setRating(starValue);
    onChange(starValue);
  };

  const getStarClass = (starValue: number) => {
    const starop = starValue <= rating ? styles.filled : styles.empty;
    console.log("starop => ", starop, " => ", starValue, rating)
    return starop
  };

  return (
    <div className={styles.starRating}>
      
      {[1, 2, 3, 4, 5].map((starValue) => (
        <span
          key={starValue}
          style={{ fontSize: `${fontSize}px`, cursor: editable ? 'pointer' : 'default' }} // Pointer cursor only if editable
          className={getStarClass(starValue)}
          onClick={() => handleClick(starValue)}
        >
          ★
        </span>
      ))}
      <input type="hidden" value={rating} />
    </div>
  );
};

export default StarRating;
