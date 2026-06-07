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
                <footer class="footer">

    <!-- Contact Information -->
    <section class="footer-contact">
        <h2>સ્વદેશ સંદેશ</h2>
        <p><strong>મોબાઇલ:</strong> 94263 51154</p>
    </section>

    <!-- Help & Support Information -->
    <section class="footer-services">
        <h3>અમારો સંપર્ક કરો</h3>

        <ol>
            <li>સ્ત્રીઓ, બાળકો કે કોઈ વ્યક્તિ પર અત્યાચાર, શોષણ અથવા અન્યાય થતો હોય.</li>

            <li>ભણતર, દવા, બ્લડ અથવા વૃદ્ધાશ્રમ માટે મદદની જરૂર હોય.</li>

            <li>વિધવા, અપંગ અથવા નિરાધાર વ્યક્તિને સમાજ સુરક્ષા ખાતામાં મદદની જરૂર હોય.</li>

            <li>RTI Act 2005 અંગે માર્ગદર્શન માટે સંપર્ક કરો.</li>
        </ol>

        <p>
            જો જીવનમાં મુશ્કેલી અનુભવતા હોવ, જીવન જીવવાનો માર્ગ ન મળતો હોય
            અથવા નકારાત્મક વિચારો આવતા હોય તો અમારો સંપર્ક અવશ્ય કરો.
        </p>
    </section>

    <!-- Publication Details -->
    <section class="footer-publication">
        <p>
            <strong>Owner, Printer, Publisher &amp; Editor:</strong>
            Gajjar Yogeshbhai Jagjivanbhai
        </p>

        <address>
            <strong>Printed At:</strong>
            Shivam Offset, Plot No. 101/1/8, GIDC, Sector-28, Gandhinagar
        </address>

        <address>
            <strong>Published By:</strong>
            "Swadesh Sandesh" Office,
            D-40, Janmbhumi Society, Kadi,
            Ta. Kadi, Dist. Mahesana - 382715
        </address>
    </section>

    <!-- Copyright -->
    <section class="footer-copyright">
        <p>&copy; Swadesh Sandesh News. All Rights Reserved.</p>
    </section>

</footer>
        </Box>

    );
};

export default Footer;
