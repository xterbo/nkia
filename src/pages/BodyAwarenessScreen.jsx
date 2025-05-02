import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './BodyAwarenessScreen.module.css';
import backgroundImage from '../assets/background.png';

const BodyAwarenessScreen = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);
  const duration = 420; // 7 minutes in seconds

  const bodyPartInstructions = [
    "Focus on your head and face. Notice any tension or sensations.",
    "Move your awareness to your neck and shoulders. Feel any tightness or relaxation.",
    "Bring attention to your chest and upper back. Notice your breathing.",
    "Focus on your arms and hands. Feel any tingling or warmth.",
    "Notice your abdomen and lower back. Feel the movement of your breath.",
    "Finally, bring awareness to your legs and feet. Feel the connection with the ground."
  ];

  const speakInstruction = (instruction) => {
    if (!isMuted && isPlaying) {
      const utterance = new SpeechSynthesisUtterance(instruction);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle position changes and voice
  const moveToNextPosition = () => {
    setCurrentPosition(prev => {
      const newPosition = (prev % 6) + 1;
      // Speak immediately when position changes
      speakInstruction(bodyPartInstructions[newPosition - 1]);
      return newPosition;
    });
    setCountdown(5);
  };

  // Handle countdown timer
  useEffect(() => {
    if (isPlaying) {
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            moveToNextPosition();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isPlaying]);
  
  useEffect(() => {
    if (isPlaying) {
      // Speak the first instruction when starting
      if (progress === 0) {
        speakInstruction(bodyPartInstructions[currentPosition - 1]);
      }

      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / duration);
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 5000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, isMuted]);

  const handleBack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    window.speechSynthesis.cancel();
    
    const confirmed = window.confirm('Did you complete the body awareness exercise?');
    if (confirmed) {
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      const updatedHabits = habits.map(habit => {
        if (habit.day === 2) {
          return { ...habit, completed: true };
        }
        return habit;
      });
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      const currentXP = parseInt(localStorage.getItem('xp') || '0');
      localStorage.setItem('xp', (currentXP + 10).toString());
      localStorage.setItem('currentDay', '3');
    }
    navigate('/habits');
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    } else {
      setCountdown(5);
      // Speak current instruction when resuming
      speakInstruction(bodyPartInstructions[currentPosition - 1]);
    }
  };

  const resetPosition = () => {
    setCurrentPosition(1);
    setProgress(0);
    setCountdown(5);
    window.speechSynthesis.cancel();
    // Speak first instruction when resetting
    if (isPlaying) {
      setTimeout(() => {
        speakInstruction(bodyPartInstructions[0]);
      }, 100);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis.cancel();
    } else if (isPlaying) {
      // Speak current instruction when unmuting
      speakInstruction(bodyPartInstructions[currentPosition - 1]);
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>←</button>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Body Awareness</h1>
          <p className={styles.subtitle}>7-minute guided session</p>
        </div>
      </div>

      <motion.div 
        className={styles.instruction}
        key={currentPosition}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>{bodyPartInstructions[currentPosition - 1]}</p>
        {isPlaying && (
          <motion.div 
            className={styles.countdown}
            key={countdown}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {countdown}
          </motion.div>
        )}
      </motion.div>

      <div className={styles.bodyContainer}>
        <div className={styles.circularScanner}>
          <div className={styles.rippleCircle}></div>
          <div className={styles.rippleCircle}></div>
          <div className={styles.rippleCircle}></div>
          <div className={styles.radarSweep}></div>
          <div className={styles.scanLine}></div>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.goal}>Goal: Tune in to physical sensations from head to toe</p>
        <div className={styles.progressBar}>
          <motion.div 
            className={styles.progressFill}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className={styles.controls}>
          <button className={styles.resetButton} onClick={resetPosition}>↺</button>
          <button className={styles.playButton} onClick={togglePlay}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <button className={styles.resetButton} onClick={toggleMute}>
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BodyAwarenessScreen; 