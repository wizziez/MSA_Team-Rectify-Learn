import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';
import QuizPage from './pages/QuizPage';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MyQuizzes from './pages/MyQuizzes';
import QuizHistory from './pages/QuizHistory';
import Review from './pages/Review';
import Flashcards from './pages/Flashcards';
import Mnemonics from './pages/Mnemonics';
import StudyPlanner from './pages/StudyPlanner';
import StudyPlanDetail from './pages/StudyPlanDetail';
import Faq from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Pricing from './pages/Pricing';
import AboutUs from './pages/AboutUs';
import DemoQuizPage from './pages/DemoQuizPage'; // Import the new DemoQuizPage
import Chatbot from './pages/Chatbot';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';

function App() {
  const { currentUser } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const splashScreenShown = sessionStorage.getItem('splashScreenShown');
    if (splashScreenShown) {
      setShowSplash(false);
      setAppReady(true);
    }
  }, []);

  // Handle splash screen completion
  const handleSplashFinish = () => {
    setAppReady(true);
    sessionStorage.setItem('splashScreenShown', 'true');
    // Remove splash screen after animation completes
    setTimeout(() => {
      setShowSplash(false);
    }, 100);
  };

  // This prevents a flash of the main content before the splash screen
  useEffect(() => {
    document.body.style.overflow = showSplash ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSplash]);

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      
      {appReady && (
        <Router>
          <ScrollToTop />
          <Navbar />
          <main style={{ overflowX: 'hidden' }}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} 
              />
              <Route 
                path="/signup" 
                element={!currentUser ? <Signup /> : <Navigate to="/dashboard" />} 
              />
              
              <Route 
                path="/forgot-password" 
                element={<ForgotPassword />} 
              />
              
              <Route 
                path="/reset-password" 
                element={<ResetPassword />} 
              />
              
              {/* Landing page - Visible to everyone */}
              <Route path="/" element={<Landing />} />
              <Route path="/demo-quiz" element={<DemoQuizPage />} /> {/* Add the new demo quiz route */}
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/upload" 
                element={
                  <PrivateRoute>
                    <FileUpload />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/quiz/:documentId" 
                element={
                  <PrivateRoute>
                    <QuizPage />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/my-quizzes" 
                element={
                  <PrivateRoute>
                    <MyQuizzes />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/flashcards" 
                element={
                  <PrivateRoute>
                    <Flashcards />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/quiz-history" 
                element={
                  <PrivateRoute>
                    <QuizHistory />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/review" 
                element={
                  <PrivateRoute>
                    <Review />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/mnemonics" 
                element={
                  <PrivateRoute>
                    <Mnemonics />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/study-planner" 
                element={
                  <PrivateRoute>
                    <StudyPlanner />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/study-plan/:planId" 
                element={
                  <PrivateRoute>
                    <StudyPlanDetail />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/chatbot" 
                element={
                  <PrivateRoute>
                    <Chatbot />
                  </PrivateRoute>
                } 
              />
              
              <Route path="/faq" element={<Faq />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<AboutUs />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      )}
    </>
  );
}

export default App;
