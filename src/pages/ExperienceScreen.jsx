import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed CustomButton import if no longer needed elsewhere
// import CustomButton from '../components/CustomButton'; 
import styles from './ExperienceScreen.module.css';

const options = [
  'Total beginner',
  "I've meditated a few times",
  'I meditate a lot'
];

function ExperienceScreen() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log('Selected experience:', option);
    // Navigate immediately to the next onboarding step (Goals)
    navigate('/onboarding/goals'); 
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Do you have any meditation experience?</h2>
      
      <div className={styles.optionsList}>
        {options.map((option) => (
          <div 
            key={option}
            className={`${styles.optionItem} ${selectedOption === option ? styles.selected : ''}`}
            onClick={() => handleSelect(option)}
          >
            <span>{option}</span>
            <span className={styles.arrowIcon}>{/* TODO: Replace with arrow icon asset */}→</span>
          </div>
        ))}
      </div>

      {/* Removed CustomButton */}
      {/* 
      <CustomButton onClick={handleContinue} className={styles.continueButton}>
        Continue
      </CustomButton>
      */}
    </div>
  );
}

export default ExperienceScreen; 