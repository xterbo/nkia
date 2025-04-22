import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './IntroScreen.module.css'; // We'll create this next
import CustomButton from '../components/CustomButton'; // Import the new button
// import CustomButton from '../components/CustomButton'; // Placeholder for the button

function IntroScreen() {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/auth'); // Navigate to Auth screen
  };

  return (
    <div className={styles.container}>
      {/* Background image needed */}
      <p className={styles.text}>
        Research shows that Nkia has helped more than 5000 student around the world.
      </p>
      {/* Replace standard button with CustomButton */}
      <CustomButton onClick={handleJoin} className={styles.joinButton}>
        Join Today
      </CustomButton>
      {/* Ornate borders */}
    </div>
  );
}

export default IntroScreen; 