import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SplashScreen.module.css'; // We'll create this next

function SplashScreen() {
  const navigate = useNavigate();

  // Simulate loading and navigate to the next screen
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/intro'); // Navigate to Intro screen after a delay
    }, 3000); // 3 second delay for splash screen
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      {/* We need the background image asset */}
      <h1 className={styles.title}>Nkia</h1>
      <p className={styles.subtitle}>Light up your body</p>
      {/* Ornate borders would likely be part of the background or overlay images */}
    </div>
  );
}

export default SplashScreen; 