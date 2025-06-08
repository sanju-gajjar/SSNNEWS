import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios'; // Add axios for API calls
import logo from '../images/newLogo-transperant.png'; // Import the logo

const HeaderAfterLogin = ({ userName, userLocation }) => {
    const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
    const [selectedDistrict, setSelectedDistrict] = useState(''); // State for selected district
    const [isUpdatingDistrict, setIsUpdatingDistrict] = useState(false); // Add a flag to prevent multiple API calls

    const handleLocationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLocationClose = () => {
        setAnchorEl(null);
    };

    const handleDistrictSelect = async (district) => {
        if (isUpdatingDistrict) return; // Prevent multiple calls if already updating
        setIsUpdatingDistrict(true); // Set the flag to true

        setSelectedDistrict(district);
        setAnchorEl(null);

        try {
            // Update user's district in the backend
            await axios.post('/api/user/update-district', { district, userName });
            alert(`District updated to ${district}`);
        } catch (error) {
            console.error('Error updating district:', error);
            alert('Failed to update district');
        } finally {
            setIsUpdatingDistrict(false); // Reset the flag after the API call
        }
    };

    const districts = [
        'AHMADABAD', 'AMRELI', 'ANAND', 'ARAVALLI', 'BANASKANTHA', 'BHARUCH', 'BHAVNAGAR', 'BOTAD',
        'CHHOTA UDEPUR', 'DAHOD', 'DANGS', 'DEVBHUMI DWARKA', 'GANDHINAGAR', 'GIR SOMNATH', 'JAMNAGAR',
        'JUNAGADH', 'KACHCHH', 'KHEDA', 'MAHESANA', 'MAHISAGAR', 'MORBI', 'NARMADA', 'NAVSARI',
        'PANCHMAHALS', 'PATAN', 'PORBANDAR', 'RAJKOT', 'SABARKANTHA', 'SURAT', 'SURENDRANAGAR',
        'TAPI', 'VADODARA', 'VALSAD'
    ];

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#f5f5f5', color: '#000', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
                {/* First row: Logo and right menu */}
                <Toolbar>
                    <Box component="img" src={logo} alt="Logo" sx={{ width: 50, height: 50, mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', textAlign: 'left' }}>
                        {/* Removed logo from Typography */}
                    </Typography>
                    <IconButton color="inherit" onClick={handleLocationClick}>
                        <LocationOnIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {userLocation || 'Select Location'}
                        </Typography>
                    </IconButton>
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
                {/* Second row: Menu items directly */}
                <Toolbar sx={{ minHeight: 40, justifyContent: 'space-around' }}>
                    {['HOME', 'GUJARAT', 'SPORTS', 'IPL 2025', 'INDIA', 'PAHALGAM ATTACK', 'WORLD', 'LIFESTYLE', 'KNOWLEDGE', 'BHAKTI', 'SUPPLEMENT', 'E-PAPER'].map((menuItem, index) => (
                        <Button key={index} color="inherit">
                            {menuItem}
                        </Button>
                    ))}
                </Toolbar>
            </AppBar>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleLocationClose}>
                {districts.map((district, index) => (
                    <MenuItem key={index} onClick={() => handleDistrictSelect(district)}>
                        {`${index + 1}. ${district}`}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default HeaderAfterLogin;
