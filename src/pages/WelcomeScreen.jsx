import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import styles from './WelcomeScreen.module.css';
// Import assets
import ScrollImage from '../assets/images/scroll.png';
import AvatarImage from '../assets/images/avatar.png'; // Import avatar image

function WelcomeScreen() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Navigate directly to the Main Map screen
    navigate('/map'); 
    // Old navigation removed
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        {/* Scroll container - apply image via style */}
        <div 
          className={styles.scrollContainer}
          style={{ backgroundImage: `url(${ScrollImage})` }} // Apply background image
        >
          {/* Placeholder for scroll background image */}
          {/* <div className={styles.scrollImagePlaceholder}>Scroll BG</div> */}
          
          {/* Content inside the scroll */}
          <div className={styles.scrollContent}>
            {/* Use actual avatar image */}
            <img src={AvatarImage} alt="User Avatar" className={styles.avatarImage} />
            {/* Placeholder removed */}
            <h2 className={styles.welcomeText}>Welcome Esther!!</h2>
          </div>
        </div>

        <p className={styles.introText}>
          Hey, i'm Nkia. I have gamified your meditation journey for you, see next steps!
        </p>
      </div>

      <CustomButton onClick={handleContinue} className={styles.continueButton}>
        Continue
      </CustomButton>
    </div>
  );
}

export default WelcomeScreen; 