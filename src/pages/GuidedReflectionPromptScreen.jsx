import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const prompts = [
  {
    question: 'Take a deep breath. What emotion are you feeling most strongly right now?',
    options: [
      { label: 'Happy', emoji: '😊' },
      { label: 'Sad', emoji: '😢' },
      { label: 'Angry', emoji: '😠' },
      { label: 'Calm', emoji: '😌' },
      { label: 'Anxious', emoji: '😰' },
      { label: 'Excited', emoji: '🤩' },
      { label: 'Tired', emoji: '🥱' },
      { label: 'Other', emoji: '🤔' }
    ]
  },
  {
    question: 'What do you think triggered this emotion today?',
    options: [
      { label: 'Work/School', emoji: '💼' },
      { label: 'Family', emoji: '👨‍👩‍👧‍👦' },
      { label: 'Friends', emoji: '🧑‍🤝‍🧑' },
      { label: 'Health', emoji: '🩺' },
      { label: 'Finances', emoji: '💸' },
      { label: 'No idea', emoji: '❓' },
      { label: 'Other', emoji: '🤔' }
    ]
  },
  {
    question: 'How is this emotion showing up in your body?',
    options: [
      { label: 'Tension', emoji: '💪' },
      { label: 'Warmth', emoji: '🌞' },
      { label: 'Energy', emoji: '⚡' },
      { label: 'Fatigue', emoji: '😴' },
      { label: 'Tears', emoji: '😭' },
      { label: 'No sensation', emoji: '🫥' },
      { label: 'Other', emoji: '🤔' }
    ]
  },
  {
    question: 'What would you like to say to yourself about this emotion?',
    options: [
      { label: "It's okay to feel this", emoji: '💚' },
      { label: 'I accept it', emoji: '🤲' },
      { label: 'I want to change it', emoji: '🔄' },
      { label: 'I need support', emoji: '🤝' },
      { label: "I'm grateful for it", emoji: '🙏' },
      { label: 'Other', emoji: '🤔' }
    ]
  },
  {
    question: 'What is one gentle thing you can do for yourself right now?',
    options: [
      { label: 'Take a walk', emoji: '🚶' },
      { label: 'Drink water', emoji: '💧' },
      { label: 'Rest', emoji: '🛌' },
      { label: 'Talk to someone', emoji: '🗣️' },
      { label: 'Breathe deeply', emoji: '🌬️' },
      { label: 'Other', emoji: '🤔' }
    ]
  }
];

const ENCOURAGING_MESSAGE = "Great job reflecting on your emotions! Remember, every feeling is valid and you're taking positive steps for your well-being.";

const GuidedReflectionPromptScreen = () => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(prompts.length).fill(null));
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  const handlePrev = () => {
    setDirection(-1);
    setIndex(i => Math.max(i - 1, 0));
  };
  const handleNext = () => {
    if (index < prompts.length - 1) {
      setDirection(1);
      setIndex(i => i + 1);
    }
  };

  const handleSelectOption = (option) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[index] = option.label;
      return updated;
    });
    // Auto-advance or show summary if last prompt
    if (index < prompts.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setIndex(i => i + 1);
      }, 350);
    } else {
      setTimeout(() => setShowSummary(true), 400);
    }
  };

  // Animation variants for framer-motion
  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0 })
  };

  const handleFinish = () => {
    // Navigate to habits screen, passing task info for confirmation
    navigate('/habits', { 
      state: { 
        taskIdentifier: 'emotional-check-in', // Identifier for the main habit
        taskTitle: 'the Emotional Check-In'    // Title for the modal message
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fce9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: 24, marginBottom: 16, paddingLeft: 8 }}>
        <button style={{ background: 'none', border: 'none', fontSize: 28, color: '#222', marginRight: 8, cursor: 'pointer' }} onClick={() => navigate(-1)}>&larr;</button>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#222', margin: 0, fontFamily: 'Bellota, sans-serif' }}>Guided Reflection</h2>
          <div style={{ fontSize: 15, color: '#444', marginTop: 2, fontFamily: 'Bellota, sans-serif' }}>Take a moment to reflect</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {!showSummary ? (
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(201,245,106,0.10)', padding: '32px 20px 24px 20px', maxWidth: 340, width: '90%', textAlign: 'center', fontSize: 18, color: '#222', fontFamily: 'Bellota, sans-serif', marginBottom: 24, minHeight: 120, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div>{prompts[index].question}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginTop: 24, marginBottom: 32 }}>
                {prompts[index].options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleSelectOption(option)}
                    style={{
                      background: answers[index] === option.label ? '#C9F56A' : '#f0f7e0',
                      border: answers[index] === option.label ? '2px solid #b2e04e' : '2px solid #e0e9c6',
                      borderRadius: 14,
                      padding: '10px 18px',
                      fontSize: 20,
                      fontWeight: 600,
                      color: '#222',
                      fontFamily: 'Bellota, sans-serif',
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: answers[index] === option.label ? '0 2px 8px rgba(201,245,106,0.10)' : 'none',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{option.emoji}</span> {option.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 8, justifyContent: 'center', width: '100%' }}>
                <button onClick={handlePrev} disabled={index === 0} style={{ background: 'none', border: 'none', fontSize: 28, color: index === 0 ? '#bbb' : '#222', cursor: index === 0 ? 'not-allowed' : 'pointer', padding: 8 }}>
                  <FaArrowLeft />
                </button>
                <span style={{ fontSize: 15, color: '#444', fontFamily: 'Bellota, sans-serif' }}>Prompt {index + 1} of {prompts.length}</span>
                <button
                  onClick={handleNext}
                  disabled={!answers[index] || index === prompts.length - 1}
                  style={{ background: 'none', border: 'none', fontSize: 28, color: (!answers[index] || index === prompts.length - 1) ? '#bbb' : '#222', cursor: (!answers[index] || index === prompts.length - 1) ? 'not-allowed' : 'pointer', padding: 8 }}
                >
                  <FaArrowRight />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(201,245,106,0.10)', padding: '32px 20px 24px 20px', maxWidth: 340, width: '90%', textAlign: 'center', fontSize: 18, color: '#222', fontFamily: 'Bellota, sans-serif', marginBottom: 24, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#4CAF50' }}>Reflection Complete!</div>
            <div style={{ marginBottom: 18, fontSize: 16, color: '#333' }}>{ENCOURAGING_MESSAGE}</div>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: 18 }}>
              {prompts.map((p, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{p.question}</div>
                  <div style={{ fontSize: 16, color: '#222', marginLeft: 8, marginTop: 2 }}>
                    {p.options.find(opt => opt.label === answers[i])?.emoji} {answers[i]}
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleFinish}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: 14,
                padding: '14px 36px',
                fontWeight: 600,
                fontSize: 18,
                fontFamily: 'inherit',
                marginTop: 12,
                boxShadow: '0 2px 8px rgba(201,245,106,0.10)',
                cursor: 'pointer'
              }}
            >
              Finish & Save Reflection
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GuidedReflectionPromptScreen; 