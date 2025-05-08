import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import styles from './GoalsScreen.module.css';
// Revert to importing the SVG as a URL
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

  // Function to handle back navigation
  const handleBack = () => {
    navigate('/onboarding/experience'); // Navigate to Experience screen
  };

  return (
    <div className={styles.container}>
      {/* Header container for alignment */}
      <div className={styles.header}>
        <button 
          onClick={handleBack}
          className={styles.backButton} 
          aria-label="Go back"
        >
          ←
        </button>
        <h2 className={styles.title}>What do you need help with today?</h2>
      </div>
      
      <p className={styles.subtitle}>Choose up to {MAX_SELECTIONS} options you want to achieve</p>
      
      <div className={styles.optionsList}>
        {options.map((option) => (
          <div 
            key={option}
            className={`${styles.optionItem} ${selectedOptions.includes(option) ? styles.selected : ''}`}
            onClick={() => handleSelect(option)}
          >
            <span>{option}</span>
            {/* Revert back to using <img> tag with URL */}
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