import React, { useState } from 'react';
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

const theme = ThemeGenerator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(''); // State to store the user's name
  const [userLocation, setUserLocation] = useState(''); // State to store the user's location

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {isLoggedIn && <HeaderAfterLogin userName={userName} userLocation={userLocation} />}
        <Router>
          <Routes>
            <Route path="/UserHome" element={<PrivateRoute><NewsList /></PrivateRoute>} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserLocation={setUserLocation} />} />
            <Route path="/register" element={<Registration />} />
          </Routes>
        </Router>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;