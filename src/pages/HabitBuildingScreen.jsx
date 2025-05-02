import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HabitBuildingScreen.module.css';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import PageTransition from '../components/PageTransition';
import RoundedRectangle from '../assets/rounded-rectangle.svg';
import Ellipse from '../assets/ellipse.svg';
import XPJar from '../assets/images/xpjar.png';

const habitData = [
  {
    day: 1,
    title: 'Just Breathe',
    description: 'Learn to breathe mindfully',
    route: '/habits/just-breathe',
    completed: false,
  },
  {
    day: 2,
    title: 'Body Awareness',
    description: 'Connect with your body',
    route: '/habits/body-awareness',
    completed: false,
  },
  {
    day: 3,
    title: 'Mindful Moment',
    description: 'Practice being present',
    route: '/habits/visualization',
    completed: false,
  },
  {
    day: 4,
    title: 'Emotional Check-In',
    description: 'Understand your emotions',
    route: '/habits/emotional-check-in',
    completed: false,
  },
  {
    day: 5,
    title: 'Gratitude Practice',
    description: 'Cultivate thankfulness',
    route: '/habits/gratitude',
    completed: false,
  },
  {
    day: 6,
    title: 'Mindful Movement',
    description: 'Move with awareness',
    route: '/habits/mindful-movement',
    completed: false,
  }
];

const HabitBuildingScreen = () => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(1);
  const [xp, setXp] = useState(0);
  const [habits, setHabits] = useState(habitData);

  // Load saved state from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedXp = localStorage.getItem('xp');
    const savedCurrentDay = localStorage.getItem('currentDay');
    
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedXp) setXp(Number(savedXp));
    if (savedCurrentDay) setCurrentDay(Number(savedCurrentDay));
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('xp', xp.toString());
    localStorage.setItem('currentDay', currentDay.toString());
  }, [habits, xp, currentDay]);

  const handleBack = () => {
    navigate('/map');
  };

  const handleNext = (day) => {
    switch (day) {
      case 1:
        navigate('/habits/just-breathe');
        break;
      case 2:
        navigate('/habits/body-awareness');
        break;
      case 3:
        navigate('/habits/visualization');
        break;
      case 4:
        navigate('/habits/emotional-check-in');
        break;
      case 5:
        navigate('/habits/gratitude');
        break;
      case 6:
        navigate('/habits/mindful-movement');
        break;
      case 7:
        navigate('/habits/reflection');
        break;
      default:
        break;
    }
  };

  const completeTask = (day) => {
    const newHabits = habits.map(habit => {
      if (habit.day === day) {
        return { ...habit, completed: true };
      }
      return habit;
    });
    setHabits(newHabits);
    setXp(prev => prev + 10); // Add 10 XP for completing a task
    setCurrentDay(prev => Math.min(prev + 1, 7)); // Move to next day
  };

  const showCompletionDialog = (day) => {
    const confirmed = window.confirm('Did you achieve the task?');
    if (confirmed) {
      completeTask(day);
    }
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>←</button>
          <h1 className={styles.title}>7-day Habit-Building</h1>
        </div>

        <div className={styles.habitList}>
          <div className={styles.verticalLine}></div>
          
          <div className={styles.habitGroup}>
            <motion.div 
              className={styles.habitItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.progressBarWrapper}>
                <div className={`${styles.progressIndicator} ${styles.dayOne}`} />
              </div>
              <div className={styles.habitContent}>
                <div className={styles.dayRow}>
                  <span className={styles.dayLabel}>Day 1</span>
                </div>
                <span className={styles.habitTitle}>Just Breathe</span>
              </div>
              <motion.button 
                className={styles.nextButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNext(1)}
              >
                →
              </motion.button>
            </motion.div>
            
            <motion.div 
              className={styles.habitItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressIndicator} />
              </div>
              <div className={styles.habitContent}>
                <div className={styles.dayRow}>
                  <span className={styles.dayLabel}>Day 2</span>
                </div>
                <span className={styles.habitTitle}>Body Awareness</span>
              </div>
              <motion.button 
                className={styles.nextButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNext(2)}
              >
                →
              </motion.button>
            </motion.div>
          </div>

          <div className={styles.habitGroup}>
            <motion.div 
              className={styles.habitItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressIndicator} />
              </div>
              <div className={styles.habitContent}>
                <div className={styles.dayRow}>
                  <span className={styles.dayLabel}>Day 3</span>
                </div>
                <span className={styles.habitTitle}>Mindful Moment</span>
              </div>
              <motion.button 
                className={styles.nextButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNext(3)}
              >
                →
              </motion.button>
            </motion.div>

            <motion.div 
              className={styles.habitItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressIndicator} />
              </div>
              <div className={styles.habitContent}>
                <div className={styles.dayRow}>
                  <span className={styles.dayLabel}>Day 4</span>
                </div>
                <span className={styles.habitTitle}>Emotional Check-In</span>
              </div>
              <motion.button 
                className={styles.nextButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNext(4)}
              >
                →
              </motion.button>
            </motion.div>
          </div>

          <div className={styles.habitGroup}>
            <motion.div 
              className={styles.habitItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressIndicator} />
              </div>
              <div className={styles.habitContent}>
                <div className={styles.dayRow}>
                  <span className={styles.dayLabel}>Day 5</span>
                </div>
                <span className={styles.habitTitle}>Gratitude Practice</span>
              </div>
              <motion.button 
                className={styles.nextButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNext(5)}
              >
                →
              </motion.button>
            </motion.div>

            <motion.div 
              className={styles.habitItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressIndicator} />
              </div>
              <div className={styles.habitContent}>
                <div className={styles.dayRow}>
                  <span className={styles.dayLabel}>Day 6</span>
                </div>
                <span className={styles.habitTitle}>Mindful Movement</span>
              </div>
              <motion.button 
                className={styles.nextButton}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNext(6)}
              >
                →
              </motion.button>
            </motion.div>
          </div>

          <div className={styles.xpColumn}>
            <img src={XPJar} alt="XP Jar" className={styles.xpJar} />
            <div className={styles.xpBadge}>{xp}XP</div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HabitBuildingScreen; 