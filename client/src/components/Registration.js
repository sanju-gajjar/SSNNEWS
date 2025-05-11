import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// Removed unused import for 'bg'
// Removed unused import for 'Button'
import logo from '../images/log1.png';
import TextField from '@mui/material/TextField';
import { styled } from "@mui/material/styles";
import ButtonBox from './UI/ButtonBox';
import Para from './UI/Para';

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

const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://ssnnewsserver.onrender.com/register', { name, email, password });
            setMessage(response.data.message);
            if (response.data.message === 'User registered successfully') {
                navigate('/'); // Redirect to login page
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className='loginWrap'>
            <img src={logo} alt='logo' className='logo' />
            <Para variant='h2' color='secondary' text='Register' sx={{ my: 2 }} />
            <form onSubmit={handleSubmit} className='formLogin'>
                <div>
                    <CustomTextField
                        id="standard-basic"
                        label="Name"
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        type='text'
                    />
                </div>
                <div>
                    <CustomTextField
                        id="standard-basic"
                        label="Email"
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type='email'
                    />
                </div>
                <div>
                    <CustomTextField
                        id="standard-basic"
                        label="Password"
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type='password'
                    />
                </div>
                <ButtonBox type='submit' placeholder='Register' variant='contained' />
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Registration;