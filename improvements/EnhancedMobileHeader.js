// Enhanced Mobile Header Component
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
    Badge
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    LocationOn as LocationOnIcon
} from '@mui/icons-material';

const EnhancedMobileHeader = ({ userName, userLocation, onLogout }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/UserHome' },
        { text: 'Search', icon: <SearchIcon />, path: '/search' },
        { text: 'My Location', icon: <LocationOnIcon />, path: '/location' },
    ];

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
                        src="/newLogo.png" 
                        alt="SSN News" 
                        sx={{ 
                            height: { xs: 32, sm: 40 },
                            mr: 2 
                        }} 
                    />

                    <Typography 
                        variant="h6" 
                        sx={{ 
                            flexGrow: 1,
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            fontWeight: 600
                        }}
                    >
                        સ્વદેશ સંદેશ સમાચાર
                    </Typography>

                    {/* Search Icon for Mobile */}
                    {isMobile && (
                        <IconButton color="inherit" sx={{ mr: 1 }}>
                            <SearchIcon />
                        </IconButton>
                    )}

                    {/* Notifications */}
                    <IconButton color="inherit" sx={{ mr: 1 }}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* User Menu */}
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

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
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {userName}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        📍 {userLocation}
                    </Typography>
                </Box>
                
                <List>
                    {menuItems.map((item) => (
                        <ListItem 
                            button 
                            key={item.text}
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
                
                <Divider />
                
                <List>
                    <ListItem 
                        button 
                        onClick={onLogout}
                        sx={{ 
                            py: 1.5,
                            color: 'error.main',
                            '&:hover': { bgcolor: 'error.light', color: 'white' }
                        }}
                    >
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default EnhancedMobileHeader;