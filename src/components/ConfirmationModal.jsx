import React from 'react';
import styles from './ConfirmationModal.module.css';
import btnsmallSvgUrl from '../assets/icons/btnsmall.svg';

const ConfirmationModal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`} 
            onClick={onCancel}
          >
            NO
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton}`} 
            onClick={onConfirm}
          >
            YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 