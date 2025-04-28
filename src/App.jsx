import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen'; // Placeholder
import IntroScreen from './pages/IntroScreen';   // Placeholder
import AuthScreen from './pages/AuthScreen';     // Placeholder
// Import onboarding pages
import ExperienceScreen from './pages/ExperienceScreen';
import GoalsScreen from './pages/GoalsScreen';
import PracticeTimeScreen from './pages/PracticeTimeScreen';
// Import new screens
import ConfirmationScreen from './pages/ConfirmationScreen';
import WelcomeScreen from './pages/WelcomeScreen';
// Import map screens
// import MapIntroScreen from './pages/MapIntroScreen'; // Removed import
import MainMapScreen from './pages/MainMapScreen';
// ... import other page placeholders as needed ...

import './App.css'; // Assuming App.css exists for global styles

function App() {
  return (
    <Router>
      <div className="app-container"> {/* Optional: Add a container for global layout/styling */} 
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/intro" element={<IntroScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          {/* Onboarding Routes */}
          <Route path="/onboarding/experience" element={<ExperienceScreen />} /> 
          <Route path="/onboarding/goals" element={<GoalsScreen />} />
          <Route path="/onboarding/practice-time" element={<PracticeTimeScreen />} />
          <Route path="/onboarding/confirmation" element={<ConfirmationScreen />} />
          {/* Welcome Screen Route */}
          <Route path="/welcome" element={<WelcomeScreen />} /> 
          {/* Map Routes */}
          {/* <Route path="/map-intro" element={<MapIntroScreen />} /> */ /* Removed route */}
          <Route path="/map" element={<MainMapScreen />} /> 
          {/* Add routes for other screens here */}
          {/* Example:
          <Route path="/onboarding/experience" element={<ExperienceScreen />} /> 
          <Route path="/onboarding/goals" element={<GoalsScreen />} />
          */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
