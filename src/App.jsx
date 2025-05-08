import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import IntroScreen from './pages/IntroScreen';
import AuthScreen from './pages/AuthScreen';
import ExperienceScreen from './pages/ExperienceScreen';
import GoalsScreen from './pages/GoalsScreen';
import PracticeTimeScreen from './pages/PracticeTimeScreen';
import ConfirmationScreen from './pages/ConfirmationScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import MainMapScreen from './pages/MainMapScreen';
import HabitBuildingScreen from './pages/HabitBuildingScreen';
import JustBreatheScreen from './pages/JustBreatheScreen';
import BodyAwarenessScreen from './pages/BodyAwarenessScreen';
import VisualizationScreen from './pages/VisualizationScreen';
import EmotionalCheckInScreen from './pages/EmotionalCheckInScreen';
import GuidedReflectionPromptScreen from './pages/GuidedReflectionPromptScreen';
import EmojiMoodSliderScreen from './pages/EmojiMoodSliderScreen';
import MoodSelectorWheelScreen from './pages/MoodSelectorWheelScreen';
import GratitudeJarScreen from './pages/GratitudeJarScreen';
import SoundAwarenessScreen from './pages/SoundAwarenessScreen';
import ReflectionScreen from './pages/ReflectionScreen';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/intro" element={<IntroScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/onboarding/experience" element={<ExperienceScreen />} />
          <Route path="/onboarding/goals" element={<GoalsScreen />} />
          <Route path="/onboarding/practice-time" element={<PracticeTimeScreen />} />
          <Route path="/onboarding/confirmation" element={<ConfirmationScreen />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/map" element={<MainMapScreen />} />
          <Route path="/habits" element={<HabitBuildingScreen />} />
          <Route path="/habits/just-breathe" element={<JustBreatheScreen />} />
          <Route path="/habits/body-awareness" element={<BodyAwarenessScreen />} />
          <Route path="/habits/visualization" element={<VisualizationScreen />} />
          <Route path="/habits/emotional-check-in" element={<EmotionalCheckInScreen />} />
          <Route path="/habits/emotional-check-in/guided-reflection" element={<GuidedReflectionPromptScreen />} />
          <Route path="/habits/emotional-check-in/emoji-slider" element={<EmojiMoodSliderScreen />} />
          <Route path="/habits/emotional-check-in/mood-wheel" element={<MoodSelectorWheelScreen />} />
          <Route path="/habits/gratitude-jar" element={<GratitudeJarScreen />} />
          <Route path="/habits/sound-awareness" element={<SoundAwarenessScreen />} />
          <Route path="/habits/reflection" element={<ReflectionScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
