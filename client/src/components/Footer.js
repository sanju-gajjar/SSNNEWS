import React from 'react';
import { Grid, Typography, Box } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px', marginTop: 'auto' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>देश-न्यूज</Typography>
                    <ul>
                        <li>Hindi News</li>
                        <li>Gujarati News</li>
                        <li>Marathi News</li>
                        <li>Latest News</li>
                    </ul>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Local News</Typography>
                    <ul>
                        <li>અમદાવાદ</li>
                        <li>સુરત</li>
                        <li>રાજકોટ</li>
                        <li>વડોદરા</li>
                    </ul>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Today Weather Update</Typography>
                    <ul>
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
