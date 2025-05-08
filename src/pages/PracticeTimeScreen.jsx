import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PracticeTimeScreen.module.css'; // Reuse styles or create new

const options = [
  'Night',
  'Afternoon',
  'Morning'
];

function PracticeTimeScreen() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    if (selectedOption) {
      console.log('Selected practice time:', selectedOption);
      // Navigate to the confirmation screen
      navigate('/onboarding/confirmation');
    }
  }, [selectedOption, navigate]);

  return (
    // Note: Screen 6 has a slightly different background style in the design
    // For now, reusing the standard container
    <div className={styles.container}>
      {/* Reuse title/list styles from ExperienceScreen.module.css potentially */}
      <h2 className={styles.title}>Pick practice time</h2> 
      
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
    </div>
  );
}

export default PracticeTimeScreen; 