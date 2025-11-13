import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    Menu,
    MenuItem,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Newspaper as NewspaperIcon,
    Gavel as GavelIcon,
    Business as BusinessIcon,
    Sports as SportsIcon,
    Movie as MovieIcon,
    Computer as ComputerIcon,
    HealthAndSafety as HealthIcon,
    Style as LifestyleIcon,
    School as SchoolIcon,
    Comment as CommentIcon,
    Article as ArticleIcon,
    PermMedia as MediaIcon,
    WbSunny as WeatherIcon,
    Info as InfoIcon,
    ExpandLess,
    ExpandMore
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { menuStructure } from '../i18n/gujaratiTranslations';

const iconMap = {
    home: <HomeIcon />,
    newspaper: <NewspaperIcon />,
    gavel: <GavelIcon />,
    business: <BusinessIcon />,
    sports: <SportsIcon />,
    movie: <MovieIcon />,
    computer: <ComputerIcon />,
    health: <HealthIcon />,
    lifestyle: <LifestyleIcon />,
    school: <SchoolIcon />,
    comment: <CommentIcon />,
    article: <ArticleIcon />,
    perm_media: <MediaIcon />,
    wb_sunny: <WeatherIcon />,
    info: <InfoIcon />
};

const GujaratiNavMenu = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEls, setAnchorEls] = useState({});
    const [expandedItems, setExpandedItems] = useState({});

    const handleMenuOpen = (event, key) => {
        setAnchorEls(prev => ({ ...prev, [key]: event.currentTarget }));
    };

    const handleMenuClose = (key) => {
        setAnchorEls(prev => ({ ...prev, [key]: null }));
    };

    const handleNavigate = (path) => {
        navigate(path);
        setDrawerOpen(false);
        // Close all menus
        setAnchorEls({});
    };

    const handleExpandClick = (key) => {
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Desktop Menu
    const DesktopMenu = () => (
        <Box sx={{ display: 'flex', gap: 1 }}>
            {menuStructure.map((item) => (
                <Box key={item.key}>
                    {item.submenu ? (
                        <>
                            <Button
                                color="inherit"
                                onClick={(e) => handleMenuOpen(e, item.key)}
                                sx={{ 
                                    fontFamily: 'Noto Sans Gujarati, sans-serif',
                                    fontSize: '0.95rem',
                                    fontWeight: 500
                                }}
                            >
                                {item.label}
                            </Button>
                            <Menu
                                anchorEl={anchorEls[item.key]}
                                open={Boolean(anchorEls[item.key])}
                                onClose={() => handleMenuClose(item.key)}
                            >
                                {item.submenu.map((subItem) => (
                                    <MenuItem
                                        key={subItem.key}
                                        onClick={() => {
                                            handleNavigate(subItem.path);
                                            handleMenuClose(item.key);
                                        }}
                                        sx={{ fontFamily: 'Noto Sans Gujarati, sans-serif' }}
                                    >
                                        {subItem.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    ) : (
                        <Button
                            color="inherit"
                            onClick={() => handleNavigate(item.path)}
                            sx={{ 
                                fontFamily: 'Noto Sans Gujarati, sans-serif',
                                fontSize: '0.95rem',
                                fontWeight: 500
                            }}
                        >
                            {item.label}
                        </Button>
                    )}
                </Box>
            ))}
        </Box>
    );

    // Mobile Drawer Menu
    const MobileMenu = () => (
        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 280,
                    fontFamily: 'Noto Sans Gujarati, sans-serif'
                }
            }}
        >
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" sx={{ fontFamily: 'Noto Sans Gujarati, sans-serif' }}>
                    SSN સમાચાર
                </Typography>
            </Box>
            <List>
                {menuStructure.map((item) => (
                    <React.Fragment key={item.key}>
                        <ListItem 
                            button 
                            onClick={() => {
                                if (item.submenu) {
                                    handleExpandClick(item.key);
                                } else {
                                    handleNavigate(item.path);
                                }
                            }}
                        >
                            <ListItemIcon>
                                {iconMap[item.icon]}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontFamily: 'Noto Sans Gujarati, sans-serif',
                                    fontWeight: 500
                                }}
                            />
                            {item.submenu && (
                                expandedItems[item.key] ? <ExpandLess /> : <ExpandMore />
                            )}
                        </ListItem>
                        {item.submenu && (
                            <Collapse in={expandedItems[item.key]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.submenu.map((subItem) => (
                                        <ListItem
                                            button
                                            key={subItem.key}
                                            sx={{ pl: 4 }}
                                            onClick={() => handleNavigate(subItem.path)}
                                        >
                                            <ListItemText 
                                                primary={subItem.label}
                                                primaryTypographyProps={{
                                                    fontFamily: 'Noto Sans Gujarati, sans-serif'
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Drawer>
    );

    return (
        <>
            <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ 
                            flexGrow: isMobile ? 1 : 0,
                            mr: 4,
                            fontFamily: 'Noto Sans Gujarati, sans-serif',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/')}
                    >
                        SSN સમાચાર
                    </Typography>

                    {!isMobile && <DesktopMenu />}
                </Toolbar>
            </AppBar>

            {isMobile && <MobileMenu />}
        </>
    );
};

export default GujaratiNavMenu;
