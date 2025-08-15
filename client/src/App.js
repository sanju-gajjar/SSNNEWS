import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import NewsList from './components/NewsList';
import NewsDetails from './components/NewsDetails';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Registration from './components/Registration';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeGenerator } from './components/UI/Theme';
import Footer from './components/Footer';
import HeaderAfterLogin from './components/HeaderAfterLogin';
import NotFound from './components/NotFound'; // Import the NotFound component
import EditNewsPage from './components/EditNewsPage/EditNewsPage';
import BottomPanel from './components/BottomPanel/BottomPanel';

const theme = ThemeGenerator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userLocation, setUserLocation] = useState(localStorage.getItem('userLocation') || '');

  useEffect(() => {
    // Sync state with localStorage changes (for multi-tab)
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('isLoggedIn'));
      setUserName(localStorage.getItem('userName') || '');
      setUserLocation(localStorage.getItem('userLocation') || '');
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
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userLocation');
    }
  }, [isLoggedIn, userName, userLocation]);

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          {/* Show header for all routes if logged in */}
          {isLoggedIn && (
            <HeaderAfterLogin
              userName={userName}
              userLocation={userLocation}
              burgerMenu
              onLogout={() => {
                setIsLoggedIn(false);
                setUserName('');
                setUserLocation('');
              }}
            />
          )}
          <Routes>
            <Route path="/UserHome" element={<PrivateRoute><NewsList /></PrivateRoute>} />
            <Route path="/news/:id" element={<NewsDetails userName={userName} userLocation={userLocation} />} />
            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserLocation={setUserLocation} />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/news/:id/update" element={<PrivateRoute><EditNewsPage /></PrivateRoute>} />
            <Route path="/edit-news" element={<PrivateRoute><EditNewsPage /></PrivateRoute>} />
            <Route path="/edit-news/:id" element={<PrivateRoute><EditNewsPage /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;