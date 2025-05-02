import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainMapScreen.module.css';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
// Import assets
import MapBgImage from '../assets/images/map-background.png';
import ScrollImage from '../assets/images/bscroll.png'; // Use the new scroll image
import AvatarImage from '../assets/images/avatar.png';
import ChallengeBannerSVG from '../assets/icons/custombutton.svg'; // Import the banner SVG URL
// Import milestone icons
import GreenStampIcon from '../assets/images/greenstamp.png';
import PurpleStampIcon from '../assets/images/purplestamp.png'; // Import purple stamp
import BlueStampIcon from '../assets/images/bluestamp.png'; // Import blue stamp
import RedStampIcon from '../assets/images/redstamp.png'; // Import red stamp
// import PurpleSealIcon from '../assets/images/image22.png'; // Removed import
// import MilestoneIcon1 from '../assets/icons/milestone-seal-red.png'; 
// import MilestoneIcon2 from '../assets/icons/milestone-seal-blue.png'; 

// Store approximate positions for milestones that trigger the popup
const milestonePositions = {
  1: { top: '283px', left: '335px', transform: 'translateX(-50%)' }, // M1 (Blue) - Small adjustment
  2: { top: '283px', left: '93px', transform: 'translateX(-50%)' },  // M2 (Red) - Small adjustment
  3: { top: '549px', left: '255px', transform: 'translateX(-50%)' }, // M3 (Purple) - Small adjustment
  4: { bottom: '80px', left: '50%', transform: 'translateX(-50%)' }, // M4 (Bottom Green) - Kept same
};

// Data for the popups
const popupData = {
  1: { 
    text: '50XP - Focus Challenge', 
    backgroundUrl: ChallengeBannerSVG, // Use green SVG
    // backgroundColor: '#42a5f5' // No longer needed
  },
  2: { 
    text: '100XP - Sleep Challenge', 
    backgroundUrl: ChallengeBannerSVG, // Use green SVG
    // backgroundColor: '#ef5350' // No longer needed
  },
  3: { 
    text: '30XP - Self-Discovery Challenge', 
    backgroundUrl: ChallengeBannerSVG, // Use green SVG
    // backgroundColor: '#ab47bc' // No longer needed
  },
  4: { 
    text: '20XP - Habit-Building Challenge', 
    backgroundUrl: ChallengeBannerSVG, // Use green SVG
    backgroundColor: null 
  }
};

function MainMapScreen() {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupTriggerId, setPopupTriggerId] = useState(null);

  const handleMilestoneClick = (milestoneId) => {
    console.log('Clicked milestone:', milestoneId);
    // Show popup for milestones 1, 2, 3, or 4
    if ([1, 2, 3, 4].includes(milestoneId)) {
      setIsPopupVisible(true);
      setPopupTriggerId(milestoneId);
    } else {
      // Handle other milestones (like 6) later
      // navigate(`/challenge/${milestoneId}`);
    }
  };

  const handleClosePopup = () => {
    // If it's the habit building challenge (ID 4), navigate to the habit screen
    if (popupTriggerId === 4) {
      navigate('/habits');
    }
    setIsPopupVisible(false);
    setPopupTriggerId(null);
    console.log('Popup banner closed');
  };

  // Function to calculate popup position based on trigger ID
  const getPopupPosition = (triggerId) => {
    const triggerPos = milestonePositions[triggerId];
    if (!triggerPos) return {};
    return triggerPos;
  };

  const currentPopupData = popupTriggerId ? popupData[popupTriggerId] : null;

  return (
    <PageTransition>
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
        {/* M1 (Blue) - Using pixel values from user */}
        <div 
          className={styles.milestone} 
          style={{ 
            top: '283px', /* Decreased from 303px */
            left: '335px' 
          }} 
          onClick={() => handleMilestoneClick(1)}
        >
          <img src={BlueStampIcon} alt="Goal 1" className={styles.milestoneImage} />
        </div>
        {/* M2 (Red) - Using pixel values from user */}
        <div 
          className={styles.milestone} 
          style={{ 
            top: '283px', /* Decreased from 303px */ 
            left: '93px' 
          }} 
          onClick={() => handleMilestoneClick(2)}
        >
          <img src={RedStampIcon} alt="Goal 2" className={styles.milestoneImage} />
        </div>
        {/* M3 (Purple) - Using pixel values from user */}
        <div 
          className={styles.milestone} 
          style={{ 
            top: '549px', 
            left: '255px' 
          }} 
          onClick={() => handleMilestoneClick(3)}
        >
          <img src={PurpleStampIcon} alt="Goal 3" className={styles.milestoneImage} />
        </div>
         {/* M4 placeholder removed from here */}
         
        {/* Removed Purple Seal Milestone (ID 5) */}

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

        {/* Conditionally render the Popup Banner */} 
        {popupTriggerId !== null && currentPopupData && (
            <div
              className={styles.popupBanner}
              style={{
                ...getPopupPosition(popupTriggerId),
                // Apply dynamic background image OR color
                backgroundImage: currentPopupData.backgroundUrl ? `url(${currentPopupData.backgroundUrl})` : 'none', 
                backgroundColor: currentPopupData.backgroundUrl ? 'transparent' : currentPopupData.backgroundColor
              }}
              onClick={handleClosePopup}
            >
              <span className={styles.popupBannerText}>{currentPopupData.text}</span>
            </div>
        )}
      </div>
    </PageTransition>
  );
}

export default MainMapScreen; 