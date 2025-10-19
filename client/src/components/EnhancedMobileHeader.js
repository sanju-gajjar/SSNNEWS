import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    useTheme,
    useMediaQuery,
    Badge,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    LocationOn as LocationOnIcon,
    ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

// Using axiosInstance instead of API_URL

const EnhancedMobileHeader = ({ userName, userLocation: initialDistrict, userRole, isLoggedIn, onLogout }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorElLocation, setAnchorElLocation] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isUpdatingDistrict, setIsUpdatingDistrict] = useState(false);
    const [district, setDistrict] = useState(localStorage.getItem('userLocation') || initialDistrict);
    

    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const districts = [
        'AHMADABAD', 'AMRELI', 'ANAND', 'ARAVALLI', 'BANASKANTHA', 'BHARUCH', 'BHAVNAGAR', 'BOTAD',
        'CHHOTA UDEPUR', 'DAHOD', 'DANGS', 'DEVBHUMI DWARKA', 'GANDHINAGAR', 'GIR SOMNATH', 'JAMNAGAR',
        'JUNAGADH', 'KACHCHH', 'KHEDA', 'MAHESANA', 'MAHISAGAR', 'MORBI', 'NARMADA', 'NAVSARI',
        'PANCHMAHALS', 'PATAN', 'PORBANDAR', 'RAJKOT', 'SABARKANTHA', 'SURAT', 'SURENDRANAGAR',
        'TAPI', 'VADODARA', 'VALSAD'
    ];

    // Define menu items based on login status and user role
    const publicMenuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Login', icon: <AccountCircleIcon />, path: '/login' }
    ];

    const baseLoggedInMenuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' }
    ];

    const adminMenuItems = [
        { text: 'Admin Panel', icon: <AccountCircleIcon />, path: '/admin' },
        { text: 'Edit News', icon: <SearchIcon />, path: '/edit-news' }
    ];

    // Check userRole from both props and localStorage
    const currentUserRole = userRole || localStorage.getItem('userRole');
    const currentIsLoggedIn = isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
    


    let menuItems;
    if (!currentIsLoggedIn) {
        menuItems = publicMenuItems;
    } else if (currentUserRole === 'admin') {
        menuItems = [...baseLoggedInMenuItems, ...adminMenuItems];
    } else {
        menuItems = baseLoggedInMenuItems;
    }


    const handleLocationClick = (event) => {
        setAnchorElLocation(event.currentTarget);
    };

    const handleLocationClose = () => {
        setAnchorElLocation(null);
    };

    const handleUserMenuClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorElUser(null);
    };

    const handleDistrictSelect = async (selectedDistrict) => {
        if (isUpdatingDistrict) return;
        setIsUpdatingDistrict(true);

        setDistrict(selectedDistrict);
        setAnchorElLocation(null);
        localStorage.setItem('userLocation', selectedDistrict);

        try {
            await axiosInstance.post(`/update-district`, { district: selectedDistrict, userName });
        } catch (error) {
            console.error('Error updating district:', error);
        } finally {
            setIsUpdatingDistrict(false);
        }
    };

    const handleMenuNavigation = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userLocation');
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
        onLogout();
        navigate('/');
    };

    return (
        <>
            <AppBar 
                position="sticky" 
                sx={{ 
                    backgroundColor: '#fff',
                    color: '#333',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 0
                }}
            >
                <Toolbar sx={{ 
                    minHeight: { xs: 56, sm: 64 },
                    px: { xs: 1, sm: 2 }
                }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ 
                            mr: 1,
                            p: { xs: 1, sm: 1.5 }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box 
                        component="img" 
                        src="/logo152.png" 
                        alt="SSN News" 
                        sx={{ 
                            width: { xs: 80, sm: 100 },
                            height: { xs: 80, sm: 100 },
                            mr: 2,
                            cursor: 'pointer',
                            objectFit: 'contain'
                        }}
                        onClick={() => navigate('/UserHome')}
                    />

                    <Typography 
                        variant="h6" 
                        sx={{ 
                            flexGrow: 1,
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/UserHome')}
                    >
                        સ્વદેશ સંદેશ સમાચાર
                    </Typography>

                    {/* Location Selector */}
                    <IconButton 
                        color="inherit" 
                        onClick={handleLocationClick}
                        sx={{ mr: 1 }}
                        disabled={isUpdatingDistrict}
                    >
                        <LocationOnIcon />
                        {!isMobile && (
                            <Typography variant="body2" sx={{ ml: 1, fontSize: '0.8rem' }}>
                                {district || 'Select'}
                            </Typography>
                        )}
                    </IconButton>

                    {/* Notifications */}
                    <IconButton color="inherit" sx={{ mr: 1 }}>
                        <Badge badgeContent={0} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* User Menu */}
                    <IconButton color="inherit" onClick={handleUserMenuClick}>
                        <AccountCircleIcon />
                        {!isMobile && (
                            <Typography variant="body2" sx={{ ml: 1, fontSize: '0.8rem' }}>
                                {userName}
                            </Typography>
                        )}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Location Menu */}
            <Menu
                anchorEl={anchorElLocation}
                open={Boolean(anchorElLocation)}
                onClose={handleLocationClose}
                PaperProps={{
                    style: {
                        maxHeight: 300,
                        width: '250px',
                    },
                }}
            >
                {districts.map((districtName) => (
                    <MenuItem
                        key={districtName}
                        onClick={() => handleDistrictSelect(districtName)}
                        selected={district === districtName}
                    >
                        {districtName}
                    </MenuItem>
                ))}
            </Menu>

            {/* User Menu */}
            <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleUserMenuClose}
            >
                <MenuItem disabled>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {userName}
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: 280, sm: 320 },
                        bgcolor: 'background.default'
                    }
                }}
            >
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box 
                            component="img" 
                            src="/logo152.png" 
                            alt="SSN News" 
                            sx={{ 
                                width: 80, 
                                height: 80, 
                                mr: 2,
                                objectFit: 'contain'
                            }} 
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            સ્વદેશ સંદેશ સમાચાર
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {currentIsLoggedIn ? userName : 'Welcome, Guest'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {currentIsLoggedIn 
                            ? `📍 ${district || 'No location set'}` 
                            : '🔍 Browse news freely'}
                    </Typography>
                </Box>
                
                <List>
                    {menuItems.map((item) => (
                        <ListItem 
                            button 
                            key={item.text}
                            onClick={() => handleMenuNavigation(item.path)}
                            sx={{ 
                                py: 1.5,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text}
                                primaryTypographyProps={{ fontWeight: 500 }}
                            />
                        </ListItem>
                    ))}
                </List>
                
                {currentIsLoggedIn && (
                    <>
                        <Divider />
                        
                        <List>
                            <ListItem 
                                button 
                                onClick={handleLogout}
                                sx={{ 
                                    py: 1.5,
                                    color: 'error.main',
                                    '&:hover': { bgcolor: 'error.light', color: 'white' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <LogoutIcon sx={{ color: 'inherit' }} />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </>
                )}
            </Drawer>
        </>
    );
};

export default EnhancedMobileHeader;