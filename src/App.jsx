import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen'; // Placeholder
import IntroScreen from './pages/IntroScreen';   // Placeholder
import AuthScreen from './pages/AuthScreen';     // Placeholder
// Import onboarding pages
import ExperienceScreen from './pages/ExperienceScreen';
import GoalsScreen from './pages/GoalsScreen';
import PracticeTimeScreen from './pages/PracticeTimeScreen';
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
