import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayIcon from '../assets/icons/play.svg';
import PauseIcon from '../assets/icons/pause.svg';
import ConfirmationModal from '../components/ConfirmationModal';

const LOCAL_STORAGE_KEY = 'reflection_day7';
const AUDIO_STORAGE_KEY = 'reflection_day7_audio';

const ReflectionScreen = () => {
  const [reflection, setReflection] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEY) || '');
  const [saved, setSaved] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunksRef = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const savedAudioDataUrl = localStorage.getItem(AUDIO_STORAGE_KEY);
    if (savedAudioDataUrl) {
      setAudioUrl(savedAudioDataUrl);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, reflection);
    setSaved(true);
  };

  const handleComplete = () => {
    setModalMessage('Did you complete your reflection?');
    setConfirmAction(() => () => processCompletion(true));
    setShowConfirmModal(true);
  };

  const processCompletion = (shouldNavigate) => {
    const currentActiveIndex = parseInt(localStorage.getItem('currentActiveIndex') || '0');
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const nextActiveIndex = 0;

    if (habits[currentActiveIndex]) {
      habits[currentActiveIndex] = {
        ...habits[currentActiveIndex],
        completed: true,
        isActive: false
      };
    }

    const updatedHabits = habits.map((habit, index) => ({
      ...habit,
      isActive: index === nextActiveIndex,
      completed: index === currentActiveIndex ? true : false
    }));

    localStorage.setItem('habits', JSON.stringify(updatedHabits));
    localStorage.setItem('currentActiveIndex', String(nextActiveIndex));

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
    navigate('/habits');
  };

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices) {
      alert('Audio recording is not supported in this browser.');
      return;
    }
    audioChunksRef.current = [];
    setRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const reader = new FileReader();
        reader.onloadend = () => {
          localStorage.setItem(AUDIO_STORAGE_KEY, reader.result);
        };
        reader.readAsDataURL(blob);
        
        if (recorder.stream && typeof recorder.stream.getTracks === 'function') {
          recorder.stream.getTracks().forEach(track => track.stop());
        }
        setRecording(false);
      };
      recorder.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
      setRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    } else {
      setRecording(false);
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7fce9 60%, #e0e9c6 100%)', fontFamily: 'Bellota, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: 24, marginBottom: 8, paddingLeft: 8 }}>
        <button style={{ background: 'none', border: 'none', fontSize: 28, color: '#222', marginRight: 8, cursor: 'pointer' }} onClick={() => navigate(-1)}>&larr;</button>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#222', margin: 0 }}>Reflection</h2>
          <div style={{ fontSize: 15, color: '#444', marginTop: 2 }}>Meditation</div>
        </div>
      </div>
      <div style={{ fontSize: 18, color: '#2b7a0b', margin: '36px 0 24px 0', textAlign: 'center', maxWidth: 320 }}>
        Take a few minutes to reflect on your mindfulness journey. How do you feel?
      </div>
      <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 10, color: '#2b7a0b', fontWeight: 600 }}>
          Voice Reflection
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 10 }}>
          {!recording ? (
            <button onClick={handleStartRecording} style={{ background: '#7ecb3a', color: '#fff', border: 'none', borderRadius: 16, padding: '10px 24px', fontWeight: 600, fontSize: 16, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 2px 8px rgba(201,245,106,0.10)' }}>
              Record
            </button>
          ) : (
            <button onClick={handleStopRecording} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 16, padding: '10px 24px', fontWeight: 600, fontSize: 16, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 2px 8px rgba(201,245,106,0.10)' }}>
              Stop
            </button>
          )}
          {audioUrl && !recording && (
            <>
              <button onClick={handlePlayAudio} disabled={isPlaying} style={{ background: 'none', border: 'none', cursor: isPlaying ? 'not-allowed' : 'pointer', padding: 0 }} aria-label="Play">
                <img src={PlayIcon} alt="play" style={{ width: 36, height: 36 }} />
              </button>
              <button onClick={handlePauseAudio} disabled={!isPlaying} style={{ background: 'none', border: 'none', cursor: !isPlaying ? 'not-allowed' : 'pointer', padding: 0 }} aria-label="Pause">
                <img src={PauseIcon} alt="pause" style={{ width: 36, height: 36 }} />
              </button>
            </>
          )}
        </div>
        {recording && <div style={{ color: '#e74c3c', fontWeight: 500 }}>Recording...</div>}
        {audioUrl && !recording && (
          <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }} />
        )}
      </div>
      <textarea
        value={reflection}
        onChange={e => { setReflection(e.target.value); setSaved(false); }}
        placeholder="Write your reflection here..."
        style={{ width: 320, minHeight: 100, borderRadius: 16, border: '1.5px solid #C9F56A', padding: 14, fontSize: 16, fontFamily: 'inherit', marginBottom: 16, background: '#fff', color: '#222', resize: 'vertical' }}
      />
      <button onClick={handleSave} style={{ background: '#7ecb3a', color: '#fff', border: 'none', borderRadius: 16, padding: '10px 28px', fontWeight: 600, fontSize: 16, fontFamily: 'inherit', marginBottom: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(201,245,106,0.10)' }}>
        Save Reflection
      </button>
      {saved && <div style={{ color: '#2b7a0b', fontSize: 15, marginBottom: 10 }}>Reflection saved!</div>}

      <button 
        onClick={handleComplete} 
        style={{
          background: '#2b7a0b',
          color: '#fff',
          border: 'none',
          borderRadius: 20,
          padding: '14px 36px',
          fontWeight: 600,
          fontSize: 18,
          fontFamily: 'inherit',
          marginTop: 12,
          boxShadow: '0 2px 8px rgba(201,245,106,0.10)',
          cursor: 'pointer'
        }}
      >
        Mark Week Complete
      </button>

      <ConfirmationModal
        show={showConfirmModal}
        message={modalMessage}
        onConfirm={confirmAction}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ReflectionScreen; 