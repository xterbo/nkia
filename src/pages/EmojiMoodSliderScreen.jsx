import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ConfirmationModal from '../components/ConfirmationModal';

const moods = [
  { label: 'Very Sad', emoji: '😭', solution: "Try reaching out to a friend or taking a few deep breaths. Remember, it's okay to feel sad." },
  { label: 'Sad', emoji: '😢', solution: 'Consider writing down your feelings or listening to calming music.' },
  { label: 'Neutral', emoji: '😐', solution: 'A short walk or a mindful pause can help you reset.' },
  { label: 'Content', emoji: '🙂', solution: 'Keep enjoying the moment! Maybe share your good mood with someone.' },
  { label: 'Happy', emoji: '😊', solution: 'Spread your happiness—send a kind message to someone!' },
  { label: 'Excited', emoji: '😁', solution: 'Channel your excitement into something creative or fun!' }
];

const ENCOURAGING_MESSAGE = "Thank you for checking in with your mood! Every feeling matters. Keep taking care of yourself.";

const EmojiMoodSliderScreen = () => {
  const [value, setValue] = useState(2); // Default to Neutral
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const handleSubmit = () => {
    setModalMessage('Confirm completion of the Mood Check-In?');
    setConfirmAction(() => () => processCompletion());
    setShowConfirmModal(true);
  };

  const processCompletion = () => {
    const currentActiveIndex = parseInt(localStorage.getItem('currentActiveIndex') || '0');
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');

    if (habits[currentActiveIndex]) {
      habits[currentActiveIndex] = {
        ...habits[currentActiveIndex],
        completed: true,
        isActive: false
      };
    }

    if (currentActiveIndex + 1 < habits.length) {
      habits[currentActiveIndex + 1] = {
        ...habits[currentActiveIndex + 1],
        completed: false,
        isActive: true
      };
    }

    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('currentActiveIndex', String(currentActiveIndex + 1));

    const currentXp = Number(localStorage.getItem('xp') || '0');
    const newXp = currentXp + 2;
    localStorage.setItem('xp', newXp.toString());

    setShowConfirmModal(false);
    setSubmitted(true);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const handleFinish = () => {
    navigate('/habits');
  };

  // For rectangle movement
  const emojiCount = moods.length;
  const emojiWidth = 40; // px
  const emojiGap = 8; // px
  const containerWidth = emojiCount * emojiWidth + (emojiCount - 1) * emojiGap;
  const rectLeft = value * (emojiWidth + emojiGap);

  return (
    <div style={{ minHeight: '100vh', background: '#f7fce9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: 24, marginBottom: 16, paddingLeft: 8 }}>
        <button style={{ background: 'none', border: 'none', fontSize: 28, color: '#222', marginRight: 8, cursor: 'pointer' }} onClick={() => navigate(-1)}>&larr;</button>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#222', margin: 0, fontFamily: 'Bellota, sans-serif' }}>Emoji-Based Mood Slider</h2>
          <div style={{ fontSize: 15, color: '#444', marginTop: 2, fontFamily: 'Bellota, sans-serif' }}>How are you feeling right now?</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {!submitted ? (
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(201,245,106,0.10)', padding: '32px 20px 24px 20px', maxWidth: 340, width: '90%', textAlign: 'center', fontSize: 18, color: '#222', fontFamily: 'Bellota, sans-serif', marginBottom: 24, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: containerWidth, height: 48, marginBottom: 18 }}>
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  position: 'absolute',
                  top: 2,
                  left: rectLeft,
                  width: emojiWidth,
                  height: 44,
                  background: '#C9F56A',
                  borderRadius: 16,
                  zIndex: 1,
                  boxShadow: '0 2px 8px rgba(201,245,106,0.10)',
                }}
              />
              <div style={{ display: 'flex', position: 'relative', zIndex: 2, gap: emojiGap }}>
                {moods.map((mood, i) => (
                  <span key={mood.label} style={{ fontSize: 28, width: emojiWidth, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: value === i ? 1 : 0.5, transition: 'opacity 0.2s' }}>{mood.emoji}</span>
                ))}
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={moods.length - 1}
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              style={{ width: '100%', margin: '12px 0 18px 0' }}
            />
            <div style={{ fontSize: 20, fontWeight: 600, color: '#4CAF50', marginBottom: 12 }}>
              {moods[value].emoji} {moods[value].label}
            </div>
            <button onClick={handleSubmit} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 20, padding: '12px 36px', fontWeight: 600, fontSize: 18, fontFamily: 'Bellota, sans-serif', marginTop: 12, boxShadow: '0 2px 8px rgba(201,245,106,0.10)', cursor: 'pointer' }}>Submit</button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(201,245,106,0.10)', padding: '32px 20px 24px 20px', maxWidth: 340, width: '90%', textAlign: 'center', fontSize: 18, color: '#222', fontFamily: 'Bellota, sans-serif', marginBottom: 24, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#4CAF50' }}>Mood Check-In Complete!</div>
            <div style={{ marginBottom: 18, fontSize: 16, color: '#333' }}>{ENCOURAGING_MESSAGE}</div>
            <div style={{ fontSize: 18, marginBottom: 12 }}>
              You selected: <span style={{ fontWeight: 600 }}>{moods[value].emoji} {moods[value].label}</span>
            </div>
            <div style={{ fontSize: 16, color: '#4CAF50', marginBottom: 16, marginTop: 8, fontWeight: 500 }}>
              {moods[value].solution}
            </div>
            <button 
              onClick={handleFinish} 
              style={{
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '12px 36px',
                fontWeight: 600,
                fontSize: 18,
                fontFamily: 'Bellota, sans-serif',
                marginTop: 16,
                cursor: 'pointer'
              }}
            >
              Finish
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        show={showConfirmModal}
        message={modalMessage}
        onConfirm={confirmAction}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EmojiMoodSliderScreen; 