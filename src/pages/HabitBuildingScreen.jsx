import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './HabitBuildingScreen.module.css';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ConfirmationModal from '../components/ConfirmationModal';
import XPJar from '../assets/images/xpjar.png';

// Original habitData - used as a base, true state managed in 'habits' state & localStorage
const baseHabitData = [
  { day: 1, title: 'Just Breathe', description: 'Learn to breathe mindfully', route: '/habits/just-breathe', taskIdentifier: 'just-breathe' },
  { day: 2, title: 'Body Awareness', description: 'Connect with your body', route: '/habits/body-awareness', taskIdentifier: 'body-awareness' },
  { day: 3, title: 'Mindful Moment', description: 'Practice being present', route: '/habits/visualization', taskIdentifier: 'visualization' },
  { day: 4, title: 'Emotional Check-In', description: 'Understand your emotions', route: '/habits/emotional-check-in', taskIdentifier: 'emotional-check-in' },
  { day: 5, title: 'Gratitude Practice', description: 'Cultivate thankfulness', route: '/habits/gratitude-jar', taskIdentifier: 'gratitude-jar' },
  { day: 6, title: 'Sound Awareness', description: 'Listen mindfully to your surroundings', route: '/habits/sound-awareness', taskIdentifier: 'sound-awareness' },
  { day: 7, title: 'Reflection', description: 'Review your mindfulness journey', route: '/habits/reflection', taskIdentifier: 'reflection' }
];

const HabitBuildingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [xp, setXp] = useState(0);
  const [habits, setHabits] = useState([]);
  
  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [taskToConfirm, setTaskToConfirm] = useState(null);

  // Load initial state from localStorage or set defaults
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedXp = localStorage.getItem('xp');
    const savedActiveIndex = parseInt(localStorage.getItem('currentActiveIndex') || '0');

    if (savedHabits) {
      const parsedSavedHabits = JSON.parse(savedHabits);
      const mergedHabits = baseHabitData.map((baseHabit, index) => {
        const savedVersion = parsedSavedHabits.find(sh => sh.taskIdentifier === baseHabit.taskIdentifier);
        return {
          ...baseHabit, // Start with all correct static data from baseHabitData
          completed: savedVersion ? savedVersion.completed : false, // Use saved completion status, or default
          isActive: index === savedActiveIndex // Determine isActive based on savedActiveIndex
        };
      });
      setHabits(mergedHabits);
    } else {
      // Initial setup: No saved habits, use baseHabitData directly
      const initialHabits = baseHabitData.map((habit, index) => ({
        ...habit,
        isActive: index === 0,
        completed: false
      }));
      setHabits(initialHabits);
      localStorage.setItem('habits', JSON.stringify(initialHabits));
      localStorage.setItem('currentActiveIndex', '0');
    }

    if (savedXp) setXp(Number(savedXp));
  }, []); // Empty dependency array: runs once on mount

  // Effect to show confirmation modal when navigating from a task screen
  useEffect(() => {
    if (location.state && location.state.taskIdentifier && location.state.taskTitle && !taskToConfirm) {
      console.log("HabitBuildingScreen: Detected navigation from task screen with state:", location.state);
      setTaskToConfirm({ 
        taskIdentifier: location.state.taskIdentifier, 
        taskTitle: location.state.taskTitle 
      });
      setModalMessage(`Did you complete ${location.state.taskTitle}?`);
      setShowConfirmModal(true);
    }
  }, [location.state, navigate, taskToConfirm]);

  const handleProcessTaskConfirmation = (didComplete) => {
    if (!taskToConfirm) return;
    console.log("HabitBuildingScreen: Processing task confirmation for:", taskToConfirm.taskIdentifier, "Did complete:", didComplete);
    console.log("HabitBuildingScreen: Current habits state BEFORE update:", JSON.parse(JSON.stringify(habits)));

    const { taskIdentifier } = taskToConfirm;
    let newXp = xp;
    let processedTaskOriginalIndex = -1;

    const updatedHabits = habits.map((habit, index) => {
      if (habit.taskIdentifier === taskIdentifier) {
        processedTaskOriginalIndex = index;
        if (didComplete && !habit.completed) {
          newXp += 2;
        }
        return { ...habit, completed: didComplete, isActive: false };
      }
      return habit;
    });

    if (processedTaskOriginalIndex !== -1) {
      if (processedTaskOriginalIndex + 1 < updatedHabits.length) {
        updatedHabits[processedTaskOriginalIndex + 1] = {
          ...updatedHabits[processedTaskOriginalIndex + 1],
          isActive: true,
          completed: false
        };
        localStorage.setItem('currentActiveIndex', String(processedTaskOriginalIndex + 1));
        console.log("HabitBuildingScreen: Next active index set to:", processedTaskOriginalIndex + 1);
      } else {
        localStorage.setItem('currentActiveIndex', String(updatedHabits.length)); 
        console.log("HabitBuildingScreen: All tasks done, active index set to:", updatedHabits.length);
      }
    } else {
      console.error("HabitBuildingScreen: ERROR - Task to confirm not found in habits array. taskIdentifier:", taskIdentifier);
    }
    
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));

    if (didComplete && newXp !== xp) {
      setXp(newXp);
      localStorage.setItem('xp', newXp.toString());
    }

    setShowConfirmModal(false);
    setTaskToConfirm(null);
    navigate(location.pathname, { replace: true, state: {} });
  };

  const handleBack = () => navigate('/map');

  const handleNext = (day) => {
    const habitToNavigate = habits.find(h => h.day === day);
    console.log(`HabitBuildingScreen: handleNext called for day ${day}. Found habit:`, habitToNavigate);
    if (habitToNavigate && habitToNavigate.route && (habitToNavigate.isActive || habitToNavigate.completed)) {
      console.log(`HabitBuildingScreen: Navigating to route: '${habitToNavigate.route}'`);
      navigate(habitToNavigate.route);
    } else {
      console.log("HabitBuildingScreen: Navigation conditions not met or route not found for day:", day, "Habit:", habitToNavigate);
    }
  };

  // Reset function (example, adjust as needed)
  const resetToTask2Active = () => {
    const initialHabits = baseHabitData.map((habit, index) => ({
      ...habit,
      completed: index === 0,
      isActive: index === 1,
    }));
    setHabits(initialHabits);
    setXp(2);
    localStorage.setItem('habits', JSON.stringify(initialHabits));
    localStorage.setItem('currentActiveIndex', '1');
    localStorage.setItem('xp', '2');
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
          {habits.map((habit, index) => (
            <motion.div 
              key={habit.day}
              className={`${styles.habitItem} ${habit.completed ? styles.completed : ''} ${habit.isActive ? styles.active : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleNext(habit.day)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.progressBarWrapper}>
                <div className={`${styles.progressIndicator} ${habit.day === 1 ? styles.dayOne : ''} ${habit.completed ? styles.completed : ''} ${habit.isActive ? styles.active : ''}`}>
                  {habit.completed && <span className={styles.checkmark}>✓</span>}
                </div>
              </div>
              <div className={styles.habitContent}>
                <div className={styles.dayRow}>
                  <span className={styles.dayLabel}>Day {habit.day}</span>
                </div>
                <span className={styles.habitTitle}>{habit.title}</span>
              </div>
              <div className={styles.nextArrow}>→</div>
            </motion.div>
          ))}
          <div className={styles.xpColumn}>
            <img src={XPJar} alt="XP Jar" className={styles.xpJar} />
            <div className={styles.xpBadge}>{xp}XP</div>
          </div>
        </div>

        <ConfirmationModal
          show={showConfirmModal}
          message={modalMessage}
          onConfirm={() => handleProcessTaskConfirmation(true)}
          onCancel={() => handleProcessTaskConfirmation(false)}
        />
      </div>
    </PageTransition>
  );
};

export default HabitBuildingScreen; 