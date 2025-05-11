import React, { useState } from 'react';
import axios from 'axios';
import AdminLeftPanel from './AdminLeftBarPanel/AdminLeftPanel';
import { Grid } from '@mui/material';
import AdminRightPanel from './AdminRightPanel/AdminRightPanel';

const AdminPanel = () => {
    const [formData, setFormData] = useState({ title: '', content: '', author: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://ssnnewsserver.onrender.com/news', formData)
            .then(response => alert('News added successfully'))
            .catch(error => console.error(error));
    };

    return (
        <Grid container spacing={2}>
            <Grid size={2}>
                <AdminLeftPanel/>
            </Grid>

            <Grid size={10} sx={{overflow:'auto',height:'100vh'}}>

                <AdminRightPanel/>
        {/* <div className="admin-panel">
            <h1>Admin Panel</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
                <textarea name="content" placeholder="Content" onChange={handleChange} required />
                <input type="text" name="author" placeholder="Author" onChange={handleChange} required />
                <button type="submit">Add News</button>
            </form>
        </div> */}
        </Grid>
        </Grid>
    );
};

export default AdminPanel;
