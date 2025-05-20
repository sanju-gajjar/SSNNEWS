import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Drawer, List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios'; // Add axios for API calls

const HeaderAfterLogin = ({ userName, userLocation }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
    const [selectedDistrict, setSelectedDistrict] = useState(''); // State for selected district
    const [isUpdatingDistrict, setIsUpdatingDistrict] = useState(false); // Add a flag to prevent multiple API calls

    const toggleMenu = (open) => () => {
        setMenuOpen(open);
    };

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
                <Toolbar>
                    {/* <Typography variant="h6" sx={{ mr: 2, fontWeight: 'bold' }}>
                       
                    </Typography> */}
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleMenu(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Swadesh Sandesh Akhbar
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
            </AppBar>
            <Drawer anchor="left" open={menuOpen} onClose={toggleMenu(false)}>
                <Box sx={{ width: 250, backgroundColor: '#f5f5f5', height: '100%' }} role="presentation" onClick={toggleMenu(false)} onKeyDown={toggleMenu(false)}>
                    <List>
                        <ListItem button>
                            <ListItemText primary={`Hello, ${userName}`} />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="HOME" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="GUJARAT" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="SPORTS" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="IPL 2025" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="INDIA" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="PAHALGAM ATTACK" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="WORLD" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="LIFESTYLE" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="KNOWLEDGE" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="BHAKTI" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="SUPPLEMENT" />
                        </ListItem>
                        <ListItem button>
                            <ListItemText primary="E-PAPER" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
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
