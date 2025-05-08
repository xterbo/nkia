import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

const moods = [
  { label: 'Joyful', emoji: '😄', solution: "Share your joy with someone or write down what made you happy." },
  { label: 'Calm', emoji: '😌', solution: "Enjoy the peace. Maybe take a few deep breaths to savor it." },
  { label: 'Anxious', emoji: '😰', solution: "Try a grounding exercise or talk to someone you trust." },
  { label: 'Sad', emoji: '😢', solution: "It's okay to feel sad. Consider listening to music or reaching out to a friend." },
  { label: 'Angry', emoji: '😠', solution: "Take a moment to pause. Try deep breathing or a short walk." },
  { label: 'Tired', emoji: '🥱', solution: "Rest if you can, or do a gentle stretch." },
  { label: 'Excited', emoji: '🤩', solution: "Channel your excitement into something creative or fun!" },
  { label: 'Other', emoji: '🤔', solution: "Take a moment to reflect on your feelings and what you need." }
];

const ENCOURAGING_MESSAGE = "Thank you for checking in with your mood! Every feeling matters. Keep taking care of yourself.";

const MoodSelectorWheelScreen = () => {
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const wheelRef = useRef(null);
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

  const getSelectedMood = (angle) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const index = Math.floor(normalizedAngle / (360 / moods.length));
    return index;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startX = e.clientX - centerX;
    const startY = e.clientY - centerY;
    setStartAngle(Math.atan2(startY, startX) * (180 / Math.PI));
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentX = e.clientX - centerX;
    const currentY = e.clientY - centerY;
    const currentAngle = Math.atan2(currentY, currentX) * (180 / Math.PI);
    
    let angleDiff = currentAngle - startAngle;
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    const newRotation = rotation + angleDiff;
    setRotation(newRotation);
    setStartAngle(currentAngle);
    
    const selectedIndex = getSelectedMood(-newRotation);
    setSelected(selectedIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const snapAngle = Math.round(rotation / (360 / moods.length)) * (360 / moods.length);
    setRotation(snapAngle);
    setSelected(getSelectedMood(-snapAngle));
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div style={{ minHeight: '100vh', background: '#f7fce9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: 24, marginBottom: 16, paddingLeft: 8 }}>
        <button style={{ background: 'none', border: 'none', fontSize: 28, color: '#222', marginRight: 8, cursor: 'pointer' }} onClick={() => navigate(-1)}>&larr;</button>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#222', margin: 0, fontFamily: 'Bellota, sans-serif' }}>Mood Selector Wheel</h2>
          <div style={{ fontSize: 15, color: '#444', marginTop: 2, fontFamily: 'Bellota, sans-serif' }}>Spin the wheel to select your mood.</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {!submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative', width: 300, height: 300 }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: '#fff',
                border: '3px solid #C9F56A',
                boxShadow: '0 4px 16px rgba(201,245,106,0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}>
                {selected !== null && (
                  <>
                    <span style={{ fontSize: 48 }}>{moods[selected].emoji}</span>
                    <span style={{ fontSize: 16, marginTop: 4, fontWeight: 700 }}>{moods[selected].label}</span>
                  </>
                )}
              </div>
              
              <div
                ref={wheelRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(201,245,106,0.10)',
                  transform: `rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                  cursor: 'grab',
                  userSelect: 'none'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
              >
                {moods.map((mood, index) => {
                  const angle = (360 / moods.length) * index;
                  return (
                    <div
                      key={mood.label}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '50%',
                        height: '50%',
                        transformOrigin: '0 0',
                        transform: `rotate(${angle}deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{
                        transform: `rotate(${90 - angle}deg)`,
                        fontSize: 24,
                        marginLeft: 20
                      }}>
                        {mood.emoji}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              style={{
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '12px 36px',
                fontWeight: 600,
                fontSize: 18,
                fontFamily: 'Bellota, sans-serif',
                boxShadow: '0 2px 8px rgba(201,245,106,0.10)',
                cursor: selected === null ? 'not-allowed' : 'pointer',
                opacity: selected === null ? 0.5 : 1
              }}
            >
              Submit
            </button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(201,245,106,0.10)', padding: '32px 20px 24px 20px', maxWidth: 340, width: '90%', textAlign: 'center', fontSize: 18, color: '#222', fontFamily: 'Bellota, sans-serif', marginBottom: 24, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#4CAF50' }}>Mood Check-In Complete!</div>
            <div style={{ marginBottom: 18, fontSize: 16, color: '#333' }}>{ENCOURAGING_MESSAGE}</div>
            <div style={{ fontSize: 18, marginBottom: 12 }}>
              You selected: <span style={{ fontWeight: 600 }}>{selected !== null && moods[selected].emoji} {selected !== null && moods[selected].label}</span>
            </div>
            <div style={{ fontSize: 16, color: '#4CAF50', marginBottom: 16, marginTop: 8, fontWeight: 500 }}>
              {selected !== null && moods[selected].solution}
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

export default MoodSelectorWheelScreen; 