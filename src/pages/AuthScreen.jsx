import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthScreen.module.css'; // We'll create this next
import CustomButton from '../components/CustomButton'; // Import the new button
// import CustomButton from '../components/CustomButton'; // Placeholder

function AuthScreen() {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In logic
    console.log('Google Sign-In clicked');
    navigate('/onboarding/experience'); // Navigate after sign-in
  };

  const handleEmailSignIn = () => {
    // TODO: Implement Email Sign-In logic/navigation
    console.log('Email Sign-In clicked');
    navigate('/onboarding/experience'); // Navigate after sign-in
  };

  return (
    <div className={styles.container}>
      {/* Background image needed */}
      <h2 className={styles.title}>Sign In/Up</h2>
      {/* Replace standard buttons with CustomButton */}
      <CustomButton onClick={handleGoogleSignIn} className={styles.authButton}>
        Google
      </CustomButton>
      <CustomButton onClick={handleEmailSignIn} className={styles.authButton}>
        Email
      </CustomButton>
      {/* Ornate borders */}
    </div>
  );
}

export default AuthScreen; 