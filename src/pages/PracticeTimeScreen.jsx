import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import styles from './PracticeTimeScreen.module.css'; // Reuse styles or create new

const options = [
  'Morning',
  'Afternoon',
  'Night'
];

function PracticeTimeScreen() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption) {
      console.log('Selected practice time:', selectedOption);
      // TODO: Navigate to the next step (Screen 7 - Confirmation)
      // navigate('/onboarding/confirmation'); 
      alert('Next screen TBD'); // Placeholder navigation
    } else {
      alert('Please select a time.');
    }
  };

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

      <CustomButton onClick={handleContinue} className={styles.continueButton}>
        Continue
      </CustomButton>
    </div>
  );
}

export default PracticeTimeScreen; 