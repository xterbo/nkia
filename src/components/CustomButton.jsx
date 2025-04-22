import React from 'react';
import PropTypes from 'prop-types';
import styles from './CustomButton.module.css';

function CustomButton({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      // Combine component styles with any additional classes passed via props
      className={`${styles.customButton} ${className}`}
    >
      <span className={styles.buttonText}>{children}</span>
    </button>
  );
}

CustomButton.propTypes = {
  children: PropTypes.node.isRequired, // Button text or content
  onClick: PropTypes.func,           // Click handler
  type: PropTypes.string,            // Button type (button, submit, reset)
  className: PropTypes.string,       // Optional additional class names
};

export default CustomButton; 