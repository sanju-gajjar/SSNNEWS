import React from 'react';
import { Grid, Typography, Box } from '@mui/material';

const Footer = () => {
    return (
        <Box 
            sx={{ 
                backgroundColor: '#f5f5f5', 
                padding: '20px', 
                marginTop: 'auto', 
                width: '100%' 
            }}
        >
            <Grid 
                container 
                spacing={2} 
                sx={{ 
                    maxWidth: '1200px', 
                    margin: '0 auto' 
                }}
            >
                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>देश-न्यूज</Typography>
                    <ul style={{ padding: 0, listStyleType: 'none' }}>
                        <li>Hindi News</li>
                        <li>Gujarati News</li>
                        <li>Marathi News</li>
                        <li>Latest News</li>
                    </ul>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Local News</Typography>
                    <ul style={{ padding: 0, listStyleType: 'none' }}>
                        <li>અમદાવાદ</li>
                        <li>સુરત</li>
                        <li>રાજકોટ</li>
                        <li>વડોદરા</li>
                    </ul>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Today Weather Update</Typography>
                    <ul style={{ padding: 0, listStyleType: 'none' }}>
                        <li>અમદાવાદ: ૩૫° સે</li>
                        <li>સુરત: ૩૨° સે</li>
                        <li>રાજકોટ: ૩૩° સે</li>
                        <li>વડોદરા: ૩૪° સે</li>
                    </ul>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;
