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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
