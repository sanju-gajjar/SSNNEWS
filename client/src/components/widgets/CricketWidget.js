import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Card, CardContent } from '@mui/material';
import SportsBaseball from '@mui/icons-material/SportsBaseball';

const CricketWidget = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProduction, setIsProduction] = useState(false);

    useEffect(() => {
        // Check if we're in production
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname === '';
        
        setIsProduction(!isLocalhost);
        
        if (!isLocalhost) {
            // Only try to load in production
            const timer = setTimeout(() => {
                try {
                    const script = document.createElement('script');
                    script.src = 'https://cdorgapi.b-cdn.net/widgets/matchlist.js';
                    script.async = true;
                    
                    script.onload = () => {
                        setIsLoading(false);
                        setError(null);
                    };
                    
                    script.onerror = () => {
                        setError('Unable to load cricket updates');
                        setIsLoading(false);
                    };
                    
                    document.head.appendChild(script);
                } catch (err) {
                    setError('Cricket widget unavailable');
                    setIsLoading(false);
                }
            }, 1000); // Delay to ensure DOM is ready
            
            return () => clearTimeout(timer);
        } else {
            // In development, show placeholder
            setIsLoading(false);
        }
    }, []);

    if (!isProduction) {
        return (
            <Card 
                sx={{ 
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    color: 'white',
                    mb: 2
                }}
            >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <SportsBaseball sx={{ fontSize: 48, mb: 2, color: '#FFA726' }} />
                    <Typography variant="h6" gutterBottom>
                        🏏 Cricket Live Updates
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Widget will be available in production environment
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                icon={<SportsBaseball />}
            >
                Cricket updates temporarily unavailable. Please check back later.
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <Card sx={{ mb: 2 }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <SportsBaseball sx={{ fontSize: 32, mb: 1, color: '#1976d2' }} />
                    <Typography variant="body2">
                        Loading cricket updates...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Box 
            sx={{ 
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                mb: 2,
                minHeight: '200px',
                '& iframe': {
                    width: '100% !important',
                    maxWidth: '100% !important',
                    height: 'auto !important',
                    border: 'none'
                }
            }}
            id="cricket-widget-live"
        />
    );
};

export default CricketWidget;