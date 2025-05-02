import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './VisualizationScreen.module.css';
import reefGif from '../assets/gif/reef.gif';
import goldenFlowerGif from '../assets/gif/golden flower.gif';
import meditationLotusGif from '../assets/gif/Meditation Lotus.gif';
import PageTransition from '../components/PageTransition';

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
      voiceGuide: "Focus on the gentle movement of the reef. Let your thoughts flow like water.",
      backgroundSound: "/sounds/ocean-waves.mp3" // You'll need to add these audio files
    },
    { 
      src: goldenFlowerGif, 
      alt: 'Golden Flower',
      voiceGuide: "Watch the golden flower bloom. Feel your awareness expanding with it.",
      backgroundSound: "/sounds/soft-music.mp3"
    },
    { 
      src: meditationLotusGif, 
      alt: 'Meditation Lotus',
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
  }, [currentGifIndex]);

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

      // Play audio and resume GIF
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play prevented'));
      }
      
      // Resume GIF animation by re-rendering it
      const gifImg = document.querySelector(`.${styles.gifImage}`);
      if (gifImg) {
        gifImg.style.opacity = '1';
      }

    } else {
      // Clear progress timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Pause audio and GIF
      if (audioRef.current) {
        audioRef.current.pause();
      }
      speechSynthesis.pause();

      // Pause GIF by hiding it temporarily
      const gifImg = document.querySelector(`.${styles.gifImage}`);
      if (gifImg) {
        gifImg.style.opacity = '0.5';
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      speechSynthesis.cancel();
    };
  }, [isPlaying]);

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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    speechSynthesis.cancel();
    navigate('/habits');
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      speechSynthesis.pause();
    } else {
      speechSynthesis.resume();
      speak(gifs[currentGifIndex].voiceGuide);
    }
  };

  const resetProgress = () => {
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    speak(gifs[currentGifIndex].voiceGuide);
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
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>←</button>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Mindful Moment</h1>
            <p className={styles.subtitle}>12-minute focus your mind</p>
          </div>
        </div>

        <div 
          className={styles.visualContainer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : (
            <AnimatePresence mode="wait" custom={swipeDirection}>
              <motion.div 
                key={currentGifIndex}
                className={styles.gifContainer}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={swipeDirection}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <img 
                  ref={el => gifRefs.current[currentGifIndex] = el}
                  src={gifs[currentGifIndex].src} 
                  alt={gifs[currentGifIndex].alt}
                  className={styles.gifImage}
                  onError={handleImageError}
                  draggable="false"
                  style={{ transition: 'opacity 0.3s' }}
                />
              </motion.div>
            </AnimatePresence>
          )}
          <div className={styles.swipeIndicator}>
            {currentGifIndex > 0 && <div className={styles.swipeUp}>⌃</div>}
            {currentGifIndex < gifs.length - 1 && <div className={styles.swipeDown}>⌄</div>}
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.goal}>Goal: Focus on the visuals to make your mind not wander.</p>
          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progressFill}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
            <motion.div 
              className={styles.progressDot}
              animate={{ left: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className={styles.controls}>
            <button className={styles.resetButton} onClick={resetProgress}>↺</button>
            <button className={styles.playButton} onClick={togglePlay}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VisualizationScreen; 