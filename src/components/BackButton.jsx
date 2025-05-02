import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './BackButton.module.css';

const BackButton = ({ customStyle = {} }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous route
  };

  return (
    <motion.button
      className={styles.backButton}
      style={customStyle}
      onClick={handleBack}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      ←
    </motion.button>
  );
};

export default BackButton; 