import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainMapScreen.module.css';
// Import assets
import MapBgImage from '../assets/images/map-background.png';
import ScrollImage from '../assets/images/bscroll.png'; // Use the new scroll image
import AvatarImage from '../assets/images/avatar.png';
import ChallengeBannerSVG from '../assets/icons/custombutton.svg'; // Import the banner SVG URL
// Import milestone icons
import GreenStampIcon from '../assets/images/greenstamp.png';
// import MilestoneIcon1 from '../assets/icons/milestone-seal-red.png'; 
// import MilestoneIcon2 from '../assets/icons/milestone-seal-blue.png'; 

function MainMapScreen() {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleMilestoneClick = (milestoneId) => {
    console.log('Clicked milestone:', milestoneId);
    if (milestoneId === 4) {
      setIsPopupVisible(true);
    } else {
      // Handle other milestones later
      // navigate(`/challenge/${milestoneId}`);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    console.log('Popup banner closed');
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${MapBgImage})` }}>
      
      {/* Top Scroll Info */}
      <div 
        className={styles.topScrollContainer}
        style={{ backgroundImage: `url(${ScrollImage})` }} // Use new scroll image
      >
        <div className={styles.topScrollContent}>
          <div className={styles.topScrollText}>
             Each stone is a goal you can achieve. Tap to see...
          </div>
          {/* Use AvatarImage */}
          <img src={AvatarImage} alt="Avatar" className={styles.topAvatarImage} /> 
        </div>
      </div>

      {/* Milestones - Absolutely positioned based on map */}
      {/* These are placeholders - need specific positions and icons */}
      <div className={styles.milestone} style={{ top: '25%', left: '70%' }} onClick={() => handleMilestoneClick(1)}>
        <div className={styles.milestoneIconPlaceholder}>M1</div>
      </div>
      <div className={styles.milestone} style={{ top: '40%', left: '30%' }} onClick={() => handleMilestoneClick(2)}>
        <div className={styles.milestoneIconPlaceholder}>M2</div>
      </div>
       <div className={styles.milestone} style={{ top: '60%', left: '65%' }} onClick={() => handleMilestoneClick(3)}>
        <div className={styles.milestoneIconPlaceholder}>M3</div>
      </div>
       <div className={styles.milestone} style={{ top: '75%', left: '20%' }} onClick={() => handleMilestoneClick(4)}>
        <img src={GreenStampIcon} alt="Goal 4" className={styles.milestoneImage} />
      </div>
      {/* ... add more milestones based on design */}

      {/* Green Stamp Milestone - Positioned at bottom center */}
      <div 
        className={styles.milestone} 
        style={{ 
          /* Position like the old banner */
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)'
        }} 
        onClick={() => handleMilestoneClick(4)} // Still ID 4
      >
        <img src={GreenStampIcon} alt="Challenge Trigger" className={styles.milestoneImage} />
      </div>

      {/* Remove banner from main layout */}

      {/* Conditionally render the Popup Banner near Green Stamp */}
      {isPopupVisible && (
          <div 
            className={styles.popupBanner} 
            style={{ 
              /* Position slightly above green stamp (bottom: 20px) */
              /* Adjust bottom value (stamp height + gap) */
              bottom: '80px', /* 50px (stamp) + 30px gap approx */
              left: '50%',
              transform: 'translateX(-50%)', 
            }}
            onClick={handleClosePopup}
          >
            {/* Ensure background is applied via CSS now */}
            <span className={styles.popupBannerText}>20XP - Habit-Building Challenge</span>
          </div>
      )}
    </div>
  );
}

export default MainMapScreen; 