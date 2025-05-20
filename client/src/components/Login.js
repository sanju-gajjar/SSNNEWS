import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import bg from '../images/bg1.jpg';
import Button from '@mui/material/Button';
import logo from '../images/log1.png';
import TextField from '@mui/material/TextField';
import { styled } from "@mui/material/styles";
import ButtonBox from './UI/ButtonBox';
import Para from './UI/Para';
import { useNavigate } from 'react-router-dom';

const CustomTextField = styled(TextField)({
  "& div.MuiFormControl-root": {
    width: '100% !important',
  },
  "& label.Mui-focused": {
    color: "black",
  },
  "& .MuiInput-underline": {
    width: '100%',
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
    "& input": {
      color: "black",
    },
  },
});

const Login = ({ setIsLoggedIn, setUserName,setUserLocation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { email, password });
        console.log(response);
        setMessage(response.data.message);
        if (response.data.message === 'Login successful') {
          setIsLoggedIn(true);
          
          setUserName(response.data.userName); // Pass the user's name
          setUserLocation(response.data.userLocation); // Pass the user's location
          navigate('/UserHome');
        }
    } catch (error) {
        setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='loginWrap'>
      <img src={logo} alt='logo' className='logo' />
      <Para variant='h2' color='secondary' text='Welcome' sx={{ my: 2 }} />
      <form onSubmit={handleSubmit} className='formLogin'>
        <div>
          <CustomTextField id="standard-basic" label="Email/Phone Number" variant="standard" value={email}
            onChange={(e) => setEmail(e.target.value)}
            required type='text' />
        </div>
        <div>
          <CustomTextField
            type="password"
            variant='standard'
            label='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <ButtonBox type='submit' placeholder='Login' variant='contained' />
      </form>
      <div style={{ marginTop: '1rem' }}>
        <p>
          Not registered yet?{' '}
          <a href="/register" style={{ color: 'blue', textDecoration: 'underline' }}>
            Register here
          </a>
        </p>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;