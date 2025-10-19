import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    p: 4
                }}
            >
                <LockIcon 
                    sx={{ 
                        fontSize: 80, 
                        color: 'error.main',
                        mb: 3
                    }} 
                />
                
                <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 2
                    }}
                >
                    403
                </Typography>
                
                <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2
                    }}
                >
                    Access Denied
                </Typography>
                
                <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                        mb: 4,
                        maxWidth: '400px',
                        lineHeight: 1.6
                    }}
                >
                    You don't have permission to access this page. Only administrators can access this section.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/UserHome')}
                        sx={{ 
                            minWidth: 120,
                            py: 1.5
                        }}
                    >
                        Go Home
                    </Button>
                    
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate(-1)}
                        sx={{ 
                            minWidth: 120,
                            py: 1.5
                        }}
                    >
                        Go Back
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Unauthorized;