import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayIcon from '../assets/icons/play.svg';
import PauseIcon from '../assets/icons/pause.svg';
import ReverseIcon from '../assets/icons/reverse.svg';
import ConfirmationModal from '../components/ConfirmationModal';
// import natureSound from '../assets/sounds/nature.mp3'; // Add your own sound file if available
import birdSoundFile from '../assets/sounds/bird-sounds.mp3'; // Import bird sound

const DURATION = 2 * 60; // Changed from 7 * 60 to 2 minutes in seconds

const SoundAwarenessScreen = () => {
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null); // Ref for the audio object
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setTimeLeft(DURATION);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Effect for managing audio playback based on isRunning state
  useEffect(() => {
    if (isRunning) {
      if (!audioRef.current) {
        audioRef.current = new Audio(birdSoundFile);
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isRunning]);

  // Effect for cleaning up audio on component unmount
  useEffect(() => {
    // Ensure audio is an Audio object before trying to pause
    const currentAudio = audioRef.current instanceof Audio ? audioRef.current : null;
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        // audioRef.current = null; // Avoid setting to null directly if other effects might use it immediately after
      }
    };
  }, []); // Empty dependency array means this runs on mount and cleanup on unmount

  // Handle back button click
  const handleBack = () => {
    pauseTimer(); // Pause the timer if running
    // Show confirmation modal
    setModalMessage('Did you complete the sound awareness exercise?');
    setConfirmAction(() => () => processCompletion(true)); // Pass true for navigation
    setShowConfirmModal(true);
  };

  const handleComplete = () => {
    // Show modal instead of directly processing completion
    setModalMessage('Did you complete the sound awareness exercise?');
    setConfirmAction(() => () => processCompletion(true)); // Pass true for navigation
    setShowConfirmModal(true);
  };

  // Completion logic using currentActiveIndex
  const processCompletion = (shouldNavigate) => {
    const currentActiveIndex = parseInt(localStorage.getItem('currentActiveIndex') || '0');
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');

    if (habits[currentActiveIndex]) {
      habits[currentActiveIndex] = {
        ...habits[currentActiveIndex],
        completed: true,
        isActive: false
      };
    }

    // Check if next index exists before setting active
    if (currentActiveIndex + 1 < habits.length) {
      habits[currentActiveIndex + 1] = {
        ...habits[currentActiveIndex + 1],
        completed: false,
        isActive: true
      };
    }
    // If it was the last habit (index 6), the next one will be set on Day 7 completion

    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('currentActiveIndex', String(currentActiveIndex + 1));

    const currentXp = Number(localStorage.getItem('xp') || '0');
    const newXp = currentXp + 2; // Consistent XP
    localStorage.setItem('xp', newXp.toString());

    setShowConfirmModal(false);

    if (shouldNavigate) {
      navigate('/habits');
    }
  };

  // Handle modal cancellation
  const handleCancel = () => {
    setShowConfirmModal(false);
    // If triggered by back button or completion button, still navigate back?
    // Decide if cancelling should still navigate or stay.
    // Let's navigate back for now.
    navigate('/habits');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eaffb7', fontFamily: 'Bellota, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
      {/* Header */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: 24, marginBottom: 8, paddingLeft: 8 }}>
        <button style={{ background: 'none', border: 'none', fontSize: 28, color: '#222', marginRight: 8, cursor: 'pointer' }} onClick={handleBack}>&larr;</button>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#222', margin: 0 }}>Sound Awareness</h2>
          <div style={{ fontSize: 15, color: '#444', marginTop: 2 }}>Touch Grass</div>
        </div>
      </div>
      {/* Prompt */}
      <div style={{ fontSize: 18, color: '#2b7a0b', margin: '36px 0 24px 0', textAlign: 'center', maxWidth: 320 }}>
        Go outside, touch grass, and listen to the sounds around you.
      </div>
      {/* Timer Display */}
      <div style={{ fontSize: 56, fontWeight: 700, color: '#2b7a0b', margin: '40px 0 24px 0', letterSpacing: 2 }}>{formatTime(timeLeft)}</div>
      {/* Timer Controls */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 32, marginBottom: 32 }}>
        {isRunning ? (
          <button onClick={pauseTimer} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Pause">
            <img src={PauseIcon} alt="pause" style={{ width: 56, height: 56 }} />
          </button>
        ) : (
          <button onClick={startTimer} disabled={timeLeft === 0} style={{ background: 'none', border: 'none', cursor: timeLeft === 0 ? 'not-allowed' : 'pointer', padding: 0, opacity: timeLeft === 0 ? 0.5 : 1 }} aria-label="Start">
            <img src={PlayIcon} alt="start" style={{ width: 56, height: 56 }} />
          </button>
        )}
      </div>
      {/* Completion */}
      {timeLeft === 0 && (
        <button onClick={handleComplete} style={{ background: '#2b7a0b', color: '#fff', border: 'none', borderRadius: 20, padding: '14px 36px', fontWeight: 600, fontSize: 18, fontFamily: 'inherit', marginTop: 12, boxShadow: '0 2px 8px rgba(201,245,106,0.10)', cursor: 'pointer' }}>
          Mark as Complete
        </button>
      )}

      {/* Render the Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmModal}
        message={modalMessage}
        onConfirm={confirmAction}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SoundAwarenessScreen; 