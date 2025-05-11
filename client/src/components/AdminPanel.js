import React, { useState } from 'react';
import axios from 'axios';
import AdminLeftPanel from './AdminLeftBarPanel/AdminLeftPanel';
import { Grid } from '@mui/material';
import AdminRightPanel from './AdminRightPanel/AdminRightPanel';
import Loader from './Loader'; // Import the Loader component

const AdminPanel = () => {
    const [formData, setFormData] = useState({ title: '', content: '', author: '' });
    const [loading, setLoading] = useState(false); // Add loading state

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        axios.post('https://ssnnewsserver.onrender.com/news', formData)
            .then(response => alert('News added successfully'))
            .catch(error => console.error(error))
            .finally(() => setLoading(false)); // Stop loading
    };

    return (
        <Grid container spacing={2}>
            {loading ? <Loader /> : (
                <>
                    <Grid size={2}>
                        <AdminLeftPanel />
                    </Grid>
                    <Grid size={10} sx={{ overflow: 'auto', height: '100vh' }}>
                        <AdminRightPanel />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default AdminPanel;
