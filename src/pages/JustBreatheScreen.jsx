import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './JustBreatheScreen.module.css';
import backgroundImage from '../assets/background.png';

const JustBreatheScreen = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('inhale');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [xp, setXp] = useState(0);
  const [showXpGain, setShowXpGain] = useState(false);
  const [xpGainPosition, setXpGainPosition] = useState(0);
  const [displayXp, setDisplayXp] = useState(0.1);
  const xpAnimationRef = useRef(null);
  const phaseTimerRef = useRef(null);
  const timerRef = useRef(null);

  const handleBack = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    window.speechSynthesis.cancel();
    
    // Show completion dialog
    const confirmed = window.confirm('Did you achieve the task?');
    if (confirmed) {
      // Save completion status
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      const updatedHabits = habits.map(habit => {
        if (habit.day === 1) {
          return { ...habit, isCompleted: true };
        }
        return habit;
      });
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      
      // Update XP
      const currentXp = Number(localStorage.getItem('xp') || '0');
      const newXp = currentXp + 10;
      localStorage.setItem('xp', newXp.toString());
      
      // Activate next task (Mindful Moments)
      localStorage.setItem('currentDay', '2');
      
      // Force a reload of the habits screen to update the state
      window.location.href = '/habits';
      return;
    }
    
    navigate('/habits');
  };

  const startXpAnimation = () => {
    if (xpAnimationRef.current) {
      clearInterval(xpAnimationRef.current);
    }

    setDisplayXp(0.1); // Start at 0.1
    let currentValue = 0.1;
    
    xpAnimationRef.current = setInterval(() => {
      currentValue += 0.1;
      if (currentValue > 2.0) {
        clearInterval(xpAnimationRef.current);
        return;
      }
      setDisplayXp(Number(currentValue.toFixed(1)));
    }, 100);

    // Clear animation after 2 seconds
    setTimeout(() => {
      if (xpAnimationRef.current) {
        clearInterval(xpAnimationRef.current);
      }
    }, 2000);
  };

  // Timer for breathing phases and XP accumulation
  useEffect(() => {
    if (!isPaused) {
      phaseTimerRef.current = setInterval(() => {
        setPhase(currentPhase => {
          if (currentPhase === 'exhale') {
            const newXp = Math.min(xp + 2, 100);
            setXp(newXp);
            const position = ((100 - newXp) / 100) * 300;
            setXpGainPosition(position);
            setShowXpGain(true);
            startXpAnimation();
            setTimeout(() => {
              setShowXpGain(false);
            }, 2000);
          }
          
          switch (currentPhase) {
            case 'inhale':
              return 'hold';
            case 'hold':
              return 'exhale';
            case 'exhale':
              return 'inhale';
            default:
              return 'inhale';
          }
        });
      }, 4000);
    }

    return () => {
      if (phaseTimerRef.current) {
        clearInterval(phaseTimerRef.current);
      }
      if (xpAnimationRef.current) {
        clearInterval(xpAnimationRef.current);
      }
    };
  }, [isPaused, xp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: 4, ease: [0.4, 0, 0.2, 1] }
    },
    hold: {
      scale: 1.5,
      transition: { duration: 4, ease: "linear" }
    },
    exhale: {
      scale: 1,
      transition: { duration: 4, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const breatheTextVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return '';
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Slowly breathe in through your nose, filling your lungs';
      case 'hold':
        return 'Gently hold your breath, staying relaxed';
      case 'exhale':
        return 'Release slowly through your mouth, letting go of tension';
      default:
        return '';
    }
  };

  const handleCompletion = () => {
    const confirmed = window.confirm('Did you achieve your breathing goal?');
    if (confirmed) {
      // Get current habits from localStorage
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      
      // Mark Just Breathe (day 1) as completed
      const updatedHabits = habits.map(habit => {
        if (habit.day === 1) {
          return { ...habit, completed: true };
        }
        return habit;
      });
      
      // Save updated habits
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      
      // Update XP
      const currentXP = parseInt(localStorage.getItem('xp') || '0');
      localStorage.setItem('xp', (currentXP + 10).toString());
      
      // Activate next task (Body Awareness)
      localStorage.setItem('currentDay', '2');
      
      // Navigate back to habits screen
      navigate('/habits');
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>←</button>
        <h1 className={styles.title}>Just Breathe</h1>
        <div className={styles.timerWrapper}>
          <span className={styles.timer}>{xp}XP</span>
        </div>
      </div>

      {/* Commented out XP progress bar
      <div className={styles.xpBar}>
        <motion.div 
          className={styles.xpProgress}
          animate={{ height: `${xp}%` }}
          transition={{ duration: 0.5 }}
        />
        <div className={styles.xpText}>{xp}XP</div>
        <AnimatePresence>
          {showXpGain && (
            <motion.div
              className={styles.xpGain}
              initial={{ opacity: 0, x: 0, y: xpGainPosition }}
              animate={{ opacity: 1, x: 30 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.5 }}
            >
              +{displayXp.toFixed(1)}XP
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      */}

      <div className={styles.breathingContainer}>
        <div className={styles.circleContainer}>
          <motion.div
            className={styles.breathingCircle}
            variants={circleVariants}
            animate={phase}
            initial="exhale"
          />
          <motion.div 
            className={styles.breatheText}
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {getPhaseText()}
          </motion.div>
        </div>
      </div>

      <div className={styles.controls}>
        <motion.div
          className={styles.instruction}
          key={phase + '-instruction'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          {getPhaseInstruction()}
        </motion.div>
        
        <button 
          className={styles.controlButton}
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
};

export default JustBreatheScreen; 