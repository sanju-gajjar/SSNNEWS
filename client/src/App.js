import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Box } from '@mui/material';
import { ThemeGenerator } from './components/UI/Theme';
import Footer from './components/Footer';
import EnhancedMobileHeader from './components/EnhancedMobileHeader';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Registration from './components/Registration';
import Unauthorized from './components/Unauthorized';
import ScrollToTop from './components/ScrollToTop';

// Lazy load components for better performance
const NewsList = lazy(() => import('./components/NewsList'));
const NewsDetails = lazy(() => import('./components/NewsDetails'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const EditNewsPage = lazy(() => import('./components/EditNewsPage/EditNewsPage'));
const BottomPanel = lazy(() => import('./components/BottomPanel/BottomPanel'));

// Loading component
const LoadingSpinner = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="50vh"
  >
    <CircularProgress />
  </Box>
);

const theme = ThemeGenerator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userLocation, setUserLocation] = useState(localStorage.getItem('userLocation') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'user');



  useEffect(() => {
    // Sync state with localStorage changes (for multi-tab)
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('isLoggedIn'));
      setUserName(localStorage.getItem('userName') || '');
      setUserLocation(localStorage.getItem('userLocation') || '');
      setUserRole(localStorage.getItem('userRole') || 'user');
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', userName);
      localStorage.setItem('userLocation', userLocation);
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userLocation');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token'); // Clear JWT token on logout
    }
  }, [isLoggedIn, userName, userLocation, userRole]);

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };

  const AdminRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" />;
    }
    if (userRole !== 'admin') {
      return <Unauthorized />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <ScrollToTop />
          {/* Show enhanced header for all users, with different features based on login status */}
          <EnhancedMobileHeader
            userName={userName}
            userLocation={userLocation}
            userRole={userRole}
            isLoggedIn={isLoggedIn}
            onLogout={() => {
              // Clear localStorage first
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userName'); 
              localStorage.removeItem('userLocation');
              localStorage.removeItem('userRole');
              localStorage.removeItem('token');
              
              // Then update state
              setIsLoggedIn(false);
              setUserName('');
              setUserLocation('');
              setUserRole('user');
            }}
          />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes - No login required */}
              <Route path="/" element={<NewsList />} />
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:id" element={<NewsDetails userName={userName} userLocation={userLocation} />} />
              <Route path="/news/:id/share" element={<NewsDetails userName={userName} userLocation={userLocation} />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserLocation={setUserLocation} setUserRole={setUserRole} />} />
              <Route path="/register" element={<Registration />} />
              
              {/* Private Routes - Login required */}
              <Route path="/UserHome" element={<PrivateRoute><NewsList /></PrivateRoute>} />
              
              {/* Admin Routes - Admin role required */}
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/news/:id/update" element={<AdminRoute><EditNewsPage /></AdminRoute>} />
              <Route path="/edit-news" element={<AdminRoute><EditNewsPage /></AdminRoute>} />
              <Route path="/edit-news/:id" element={<AdminRoute><EditNewsPage /></AdminRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;