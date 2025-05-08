import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraIcon from '../assets/icons/camera.svg';
import SendIcon from '../assets/icons/send.svg';
import ExpandIcon from '../assets/icons/expand.svg';
import ConfirmationModal from '../components/ConfirmationModal';

// Placeholder for floral border image import if available
// import floralBorder from '../assets/floral-border.png';

const LOCAL_STORAGE_KEY = 'gratitude_jar_entries';

const GratitudeJarScreen = () => {
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState([]);
  const [showFileInput, setShowFileInput] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  // Load entries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleSend = () => {
    if (input.trim() !== '') {
      setEntries([
        ...entries,
        {
          type: 'text',
          value: input,
          date: new Date().toISOString()
        }
      ]);
      setInput('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEntries([
        ...entries,
        {
          type: 'media',
          value: URL.createObjectURL(file),
          fileType: file.type,
          date: new Date().toISOString()
        }
      ]);
    }
  };

  const handleBack = () => {
    setModalMessage('Did you complete the gratitude practice for today?');
    setConfirmAction(() => () => processCompletion(true));
    setShowConfirmModal(true);
  };

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

    if (shouldNavigate) {
      navigate('/habits');
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    if (confirmAction && modalMessage === 'Did you complete the gratitude practice for today?') {
      navigate('/habits');
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7fce9',
      position: 'relative',
      fontFamily: 'Bellota, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Floral border (optional, can use an image or SVG) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        background: 'url(/assets/floral-border.png) repeat',
        opacity: 0.5,
      }} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '0 0 32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Header */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: 24, marginBottom: 8, paddingLeft: 8 }}>
          <button style={{ background: 'none', border: 'none', fontSize: 28, color: '#222', marginRight: 8, cursor: 'pointer' }} onClick={handleBack}>&larr;</button>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#222', margin: 0 }}>Gratitude Jar</h2>
            <div style={{ fontSize: 15, color: '#444', marginTop: 2 }}>Be thankful it helps</div>
          </div>
        </div>
        {/* Spacer below header */}
        <div style={{ height: 64 }} />
        {/* Title above input */}
        <div style={{ fontSize: 17, color: '#7ecb3a', fontWeight: 500, marginBottom: 6, fontFamily: 'Bellota, sans-serif', textAlign: 'center' }}>
          Write what you are thankful for
        </div>
        {/* Input area */}
        <div style={{
          width: 300,
          display: 'flex',
          alignItems: 'center',
          border: '1.5px solid #7ecb3a',
          borderRadius: 16,
          background: 'none',
          marginBottom: 28,
          padding: '0 12px',
          boxShadow: '0 2px 8px rgba(201,245,106,0.06)',
          height: 48,
        }}>
          {/* Camera/Image icon */}
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8, outline: 'none', display: 'flex', alignItems: 'center', height: 32, padding: 0 }}
            tabIndex={-1}
            aria-label="Add image or video"
          >
            <img src={CameraIcon} alt="camera" style={{ width: 22, height: 22, display: 'block' }} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Write..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 17,
              fontFamily: 'inherit',
              background: 'none',
              color: '#2b7a0b',
              padding: '0 0 0 0',
              height: 44,
              lineHeight: '44px',
              display: 'flex',
              alignItems: 'center',
            }}
          />
          {/* Send icon */}
          <button
            onClick={handleSend}
            style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8, outline: 'none', display: 'flex', alignItems: 'center', height: 32, padding: 0 }}
            aria-label="Send"
          >
            <img src={SendIcon} alt="send" style={{ width: 22, height: 22, display: 'block' }} />
          </button>
        </div>
        {/* Jar display */}
        <div style={{
          width: 300,
          background: '#eaffb7',
          borderRadius: 24,
          boxShadow: '0 2px 8px rgba(201,245,106,0.10)',
          padding: '18px 18px 18px 18px',
          marginTop: 0,
          minHeight: 120,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: '#2b7a0b', fontWeight: 600, fontSize: 16 }}>Your Jar</span>
            <span style={{ fontSize: 16, color: '#2b7a0b', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Expand">
              <img src={ExpandIcon} alt="expand" style={{ width: 20, height: 20 }} />
            </span>
          </div>
          <div style={{ fontSize: 16, color: '#222', fontFamily: 'inherit', minHeight: 40 }}>
            {entries.length === 0 && <span style={{ color: '#aaa' }}>No entries yet.</span>}
            {entries.map((entry, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <hr style={{ border: 'none', borderTop: '1px solid #d2e7a6', margin: '10px 0' }} />}
                <div style={{ marginBottom: 8, wordBreak: 'break-word', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    {entry.type === 'text' ? (
                      <span>{entry.value}</span>
                    ) : entry.fileType && entry.fileType.startsWith('image') ? (
                      <img src={entry.value} alt="Gratitude" style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8, display: 'block', margin: '6px 0' }} />
                    ) : (
                      <video src={entry.value} controls style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, display: 'block', margin: '6px 0' }} />
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#7ecb3a', marginLeft: 10, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
                    {entry.date ? new Date(entry.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
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

export default GratitudeJarScreen; 