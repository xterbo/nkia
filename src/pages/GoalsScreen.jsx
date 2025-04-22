import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import styles from './GoalsScreen.module.css';
// Import the SVG as a URL for use in <img> src
import LotusIconURL from '../assets/icons/lotus.svg';

const options = [
  'Sleep better',
  'Reduce stress or anxiety',
  'Feel less sad',
  'Motivation',
  'Panic attack', // Assuming this relates to managing them
  'Overcoming depression'
];

const MAX_SELECTIONS = 3;

function GoalsScreen() {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelect = (option) => {
    setSelectedOptions(prevSelected => {
      const isSelected = prevSelected.includes(option);
      if (isSelected) {
        // Deselect
        return prevSelected.filter(item => item !== option);
      } else {
        // Select, but only if under the limit
        if (prevSelected.length < MAX_SELECTIONS) {
          return [...prevSelected, option];
        } else {
          // Optional: Add feedback that limit is reached
          alert(`You can only choose up to ${MAX_SELECTIONS} options.`);
          return prevSelected; // Return unchanged if limit reached
        }
      }
    });
  };

  const handleContinue = () => {
    if (selectedOptions.length > 0) {
      console.log('Selected goals:', selectedOptions);
      // Navigate to the next onboarding step (Practice Time)
      navigate('/onboarding/practice-time'); 
    } else {
      alert('Please select at least one option.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>What do you need help with today?</h2>
      <p className={styles.subtitle}>Choose up to {MAX_SELECTIONS} options you want to achieve</p>
      
      <div className={styles.optionsList}>
        {options.map((option) => (
          <div 
            key={option}
            className={`${styles.optionItem} ${selectedOptions.includes(option) ? styles.selected : ''}`}
            onClick={() => handleSelect(option)}
          >
            <span>{option}</span>
            {/* Use standard img tag with imported URL */}
            <img src={LotusIconURL} className={styles.lotusIcon} alt="" />
          </div>
        ))}
      </div>

      <CustomButton onClick={handleContinue} className={styles.continueButton}>
        Continue
      </CustomButton>
    </div>
  );
}

export default GoalsScreen; 