import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import logo from '../images/newLogo-transperant.png';
import { useNavigate } from 'react-router-dom';

const HeaderAfterLogin = ({ userName, userLocation: initialDistrict, burgerMenu }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isUpdatingDistrict, setIsUpdatingDistrict] = useState(false);
    const [district, setDistrict] = useState(initialDistrict || '');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();

    const handleLocationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLocationClose = () => {
        setAnchorEl(null);
    };

    const handleDistrictSelect = async (district) => {
        if (isUpdatingDistrict) return;
        setIsUpdatingDistrict(true);

        setDistrict(district);
        setAnchorEl(null);

        try {
            await axios.post('/api/user/update-district', { district, userName });
            alert(`District updated to ${district}`);
        } catch (error) {
            console.error('Error updating district:', error);
            alert('Failed to update district');
        } finally {
            setIsUpdatingDistrict(false);
        }
    };

    const districts = [
        'AHMADABAD', 'AMRELI', 'ANAND', 'ARAVALLI', 'BANASKANTHA', 'BHARUCH', 'BHAVNAGAR', 'BOTAD',
        'CHHOTA UDEPUR', 'DAHOD', 'DANGS', 'DEVBHUMI DWARKA', 'GANDHINAGAR', 'GIR SOMNATH', 'JAMNAGAR',
        'JUNAGADH', 'KACHCHH', 'KHEDA', 'MAHESANA', 'MAHISAGAR', 'MORBI', 'NARMADA', 'NAVSARI',
        'PANCHMAHALS', 'PATAN', 'PORBANDAR', 'RAJKOT', 'SABARKANTHA', 'SURAT', 'SURENDRANAGAR',
        'TAPI', 'VADODARA', 'VALSAD'
    ];

    const menuRoutes = {
        HOME: '/UserHome',
        GUJARAT: '/gujarat',
        SPORTS: '/sports',
        LIFESTYLE: '/lifestyle',
        KNOWLEDGE: '/knowledge'
    };

    if (burgerMenu) {
        return (
            <>
                <AppBar position="static" sx={{ backgroundColor: '#f5f5f5', color: '#000', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Box component="img" src={logo} alt="Logo" sx={{ width: 50, height: 50, mx: 2 }} />
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', textAlign: 'left' }} />
                        <IconButton color="inherit" onClick={handleLocationClick}>
                            <LocationOnIcon />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                {district || 'Select Location'}
                            </Typography>
                        </IconButton>
                        <IconButton color="inherit">
                            <AccountCircleIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                    <Box sx={{ width: 220 }} role="presentation" onClick={() => setDrawerOpen(false)}>
                        <List>
                            {Object.keys(menuRoutes).map((menuItem, index) => (
                                <ListItem button key={index} onClick={() => navigate(menuRoutes[menuItem])}>
                                    <ListItemText primary={menuItem} />
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                    </Box>
                </Drawer>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleLocationClose}>
                    {districts.map((d, index) => (
                        <MenuItem key={index} onClick={() => handleDistrictSelect(d)}>
                            {`${index + 1}. ${d}`}
                        </MenuItem>
                    ))}
                </Menu>
            </>
        );
    }

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#f5f5f5', color: '#000', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
                <Toolbar>
                    <Box component="img" src={logo} alt="Logo" sx={{ width: 50, height: 50, mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', textAlign: 'left' }}>
                    </Typography>
                    <IconButton color="inherit" onClick={handleLocationClick}>
                        <LocationOnIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {/* {userLocation || 'Select Location'} */}
                        </Typography>
                    </IconButton>
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
                <Toolbar sx={{ minHeight: 40, justifyContent: 'space-around' }}>
                    {['HOME', 'GUJARAT', 'SPORTS', 'IPL 2025', 'INDIA', 'PAHALGAM ATTACK', 'WORLD', 'LIFESTYLE', 'KNOWLEDGE', 'BHAKTI', 'SUPPLEMENT', 'E-PAPER'].map((menuItem, index) => (
                        <Button key={index} color="inherit">
                            {menuItem}
                        </Button>
                    ))}
                </Toolbar>
            </AppBar>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleLocationClose}>
                {districts.map((d, index) => (
                    <MenuItem key={index} onClick={() => handleDistrictSelect(d)}>
                        {`${index + 1}. ${d}`}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default HeaderAfterLogin;
