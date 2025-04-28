import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import styles from './ConfirmationScreen.module.css';
// Import wax seal image URL
import SealImage from '../assets/images/seal.png';

function ConfirmationScreen() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Navigate to the Welcome screen
    navigate('/welcome');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Use actual image */}
        <img src={SealImage} alt="Confirmation Seal" className={styles.sealImage} /> 
        
        <h2 className={styles.title}>Great! Having a dedicated time is the best.</h2>
        <p className={styles.subtitle}>
          We'll remind you in the morning so you start your day off right!
        </p>
      </div>

      <CustomButton onClick={handleContinue} className={styles.continueButton}>
        Continue
      </CustomButton>
    </div>
  );
}

export default ConfirmationScreen; 