import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        delayChildren: 0.3, // Start children animation after container fades in (optional)
        staggerChildren: 0.2 // Stagger children animations
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, duration: 0.8 }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2 } // Delay subtitle slightly
    }
  };

  return (
    <motion.div 
      className={styles.container}
      variants={containerVariants} // Apply variants to the container
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }} // Optional: Fade out the whole screen
    >
      {/* We need the background image asset */}
      <motion.h1 
        className={styles.title}
        variants={titleVariants} // Apply variants to title
        // No initial/animate here, inherit from parent container
      >
        Nkia
      </motion.h1>
      <motion.p 
        className={styles.subtitle}
        variants={subtitleVariants} // Apply variants to subtitle
        // No initial/animate here, inherit from parent container
      >
        Light up your body
      </motion.p>
      {/* Ornate borders would likely be part of the background or overlay images */}
    </motion.div>
  );
}

export default SplashScreen; 