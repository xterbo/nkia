import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EmotionalCheckInScreen.module.css';

const EmotionalCheckInScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>&larr;</button>
        <div>
          <h2 className={styles.title}>Emotional Check-In</h2>
          <div className={styles.subtitle}>5-minute focus your mind</div>
        </div>
      </div>
      <div className={styles.centerSelection}>
        <div className={styles.prompt}>Select an emotional guide</div>
        <div className={styles.options}>
          <button className={styles.primaryOption} onClick={() => navigate('/habits/emotional-check-in/guided-reflection')}>Guided Reflection Prompt</button>
          <button className={styles.option} onClick={() => navigate('/habits/emotional-check-in/emoji-slider')}>Emoji-Based Mood Slider</button>
          <button className={styles.option} onClick={() => navigate('/habits/emotional-check-in/mood-wheel')}>Mood Selector Wheel</button>
        </div>
      </div>
    </div>
  );
};

export default EmotionalCheckInScreen; 