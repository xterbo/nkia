import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './VisualizationScreen.module.css';
import reefGif from '../assets/gif/reef.gif';
import goldenFlowerGif from '../assets/gif/golden flower.gif';
import meditationLotusGif from '../assets/gif/Meditation Lotus.gif';
import PageTransition from '../components/PageTransition';
import playIconUrl from '../assets/icons/play.svg';
import pauseIconUrl from '../assets/icons/pause.svg';
import reverseIconUrl from '../assets/icons/reverse.svg';

const VisualizationScreen = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [error, setError] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const duration = 720; // 12 minutes in seconds
  const intervalRef = useRef(null);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const audioRef = useRef(null);
  const voiceRef = useRef(null);
  const gifRefs = useRef([]);

  const gifs = [
    { 
      src: reefGif, 
      alt: 'Reef',
      taskIdentifier: 'visualization-reef',
      taskTitle: 'Reef Visualization',
      voiceGuide: "Focus on the gentle movement of the reef. Let your thoughts flow like water.",
      backgroundSound: "/sounds/ocean-waves.mp3"
    },
    { 
      src: goldenFlowerGif, 
      alt: 'Golden Flower',
      taskIdentifier: 'visualization-flower',
      taskTitle: 'Golden Flower Visualization',
      voiceGuide: "Watch the golden flower bloom. Feel your awareness expanding with it.",
      backgroundSound: "/sounds/soft-music.mp3"
    },
    { 
      src: meditationLotusGif, 
      alt: 'Meditation Lotus',
      taskIdentifier: 'visualization-lotus',
      taskTitle: 'Mindful Moment',
      voiceGuide: "Observe the lotus pattern. Let it guide you to your center.",
      backgroundSound: "/sounds/meditation-bells.mp3"
    }
  ];

  // Initialize speech synthesis
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower rate
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  // Handle audio setup when GIF changes
  useEffect(() => {
    const currentGif = gifs[currentGifIndex];
    
    // Setup background sound
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(currentGif.backgroundSound);
    audioRef.current.loop = true;
    
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log('Audio autoplay prevented'));
      speak(currentGif.voiceGuide);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      speechSynthesis.cancel();
    };
  }, [currentGifIndex, isPlaying]);

  // Handle play/pause state
  useEffect(() => {
    if (isPlaying) {
      // Start progress timer
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / duration);
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 1000);

      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play prevented'));
      }
      
      // Resume GIF animation by re-rendering it
      const gifImg = document.querySelector(`.${styles.gifImage}`);
      if (gifImg) {
        gifImg.style.opacity = '1';
      }

    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      speechSynthesis.pause();

      const gifImg = document.querySelector(`.${styles.gifImage}`);
      if (gifImg) {
        gifImg.style.opacity = '0.5';
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    const diff = touchStartY.current - touchEndY;
    const timeDiff = touchEndTime - touchStartTime.current;
    const threshold = 50;
    const maxTime = 300;

    if (timeDiff <= maxTime) {
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentGifIndex < gifs.length - 1) {
          setSwipeDirection('up');
          setCurrentGifIndex(prev => prev + 1);
        } else if (diff < 0 && currentGifIndex > 0) {
          setSwipeDirection('down');
          setCurrentGifIndex(prev => prev - 1);
        }
      }
    }
  };

  const handleBack = () => {
    // Cleanup timers and audio
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    speechSynthesis.cancel();

    // Navigate to habits screen, passing task info for confirmation
    navigate('/habits', { 
      state: { 
        taskIdentifier: 'visualization', 
        taskTitle: 'the mindful moment'
      }
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetProgressFunc = () => {
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (isPlaying) speak(gifs[currentGifIndex].voiceGuide);
  };

  const handleImageError = (e) => {
    console.error('Error loading gif:', e);
    setError('Error loading animation');
  };

  const slideVariants = {
    enter: (direction) => ({
      y: direction === 'up' ? 300 : -300,
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1
    },
    exit: (direction) => ({
      y: direction === 'up' ? -300 : 300,
      opacity: 0
    })
  };

  return (
    <PageTransition>
      <div className={styles.container} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>←</button>
          <h1 className={styles.title}>{gifs[currentGifIndex].alt}</h1>
        </div>

        <AnimatePresence initial={false} custom={swipeDirection}>
          <motion.img
            key={currentGifIndex}
            ref={el => gifRefs.current[currentGifIndex] = el}
            src={gifs[currentGifIndex].src}
            alt={gifs[currentGifIndex].alt}
            className={styles.gifImage}
            custom={swipeDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              y: { type: "tween", ease: "circOut", duration: 0.4 }, 
              opacity: { duration: 0.2 } 
            }}
            onError={handleImageError}
          />
        </AnimatePresence>
        
        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.footerControls}>
          <p className={styles.goalText}>
            Goal: Focus on the visuals to make your mind not wander.
          </p>
          
          <div className={styles.progressTrack}>
            <div className={styles.progressThumb} style={{ left: `${progress}%` }}></div>
          </div>

          <div className={styles.actionButtonsContainer}>
            <button onClick={resetProgressFunc} className={`${styles.sideControlButton} ${styles.resetLeft}`}>
              <img src={reverseIconUrl} alt="Reset" className={styles.sideControlIcon} />
            </button>
            <button onClick={togglePlay} className={styles.mainPlayPauseButton}>
              <img 
                src={isPlaying ? pauseIconUrl : playIconUrl} 
                alt={isPlaying ? "Pause" : "Play"} 
                className={styles.playPauseIcon}
              />
            </button>
            <button onClick={resetProgressFunc} className={`${styles.sideControlButton} ${styles.resetRight}`}>
              <img src={reverseIconUrl} alt="Reset" className={styles.sideControlIcon} />
            </button>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default VisualizationScreen; 