import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const HeaderAfterLogin = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = (open) => () => {
        setMenuOpen(open);
    };

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#f5f5f5', color: '#000', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleMenu(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Swadesh Sandesh Akhbar
                    </Typography>
                    <IconButton color="inherit">
                        <SearchIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <LocationOnIcon />
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
        </>
    );
};

export default HeaderAfterLogin;
