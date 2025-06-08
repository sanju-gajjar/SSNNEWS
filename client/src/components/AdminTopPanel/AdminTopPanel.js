import React, { useState } from 'react';
import Para from '../UI/Para';
import UploadButton from '../UI/UploadButton';
import { Card, CardContent, CardHeader, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import ColorSlider from '../UI/ColorSlider';
import AdminTopCss from './AdminTopPanel.css';
import axios from 'axios';

function AdminTopPanel() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    title2: '',
    content: '',
    author: '',
    approvedby: '',
    tags: '',
    top: 0,
    video: '',
    image: '',
    source: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { title, content, author, approvedby, tags, video, image, source } = formData;
    if (!title || !content || !author || !approvedby || !tags || !video || !image || !source) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/news`, { ...formData, tags: tags.split(',') });
      alert('News added successfully!');
      handleClose();
    } catch (error) {
      console.error('Error adding news:', error);
      alert('Failed to add news.');
    }
  };

  return (
    <section>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader className='cardHeader' title='Upload Top News' />
            <CardContent component='div' spacing={2} sx={{ px: 2, display: 'flex', flexDirection: 'column', height: '65%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
              <Para variant='subtitle1'>Upload top news Post from here</Para>
              <Button children='Upload Post' sx={{ mt: 2 }} onClick={handleOpen} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader className='cardHeader' title='Total Post Status' sx={{ lineHeight: 0.7 }} />
            <CardContent component='div' sx={{ px: 2 }}>
              <Para variant='subtitle2'>Followers</Para>
              <ColorSlider color='primary' defaultValue='40' val='100' />
              <Para variant='subtitle2' >Likes</Para>
              <ColorSlider color='secondary' defaultValue='60' val='140' />
              <Para variant='subtitle2'>Views</Para>
              <ColorSlider color='grey' defaultValue='20' val='100' />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader className='cardHeader' title='Live News Status' />
            <CardContent component='div' sx={{ px: 2 }}>
              <Para variant='subtitle2'>Views</Para>
              <ColorSlider color='secondary' defaultValue='40' val='100' />
              <Para variant='subtitle2' >Likes</Para>
              <ColorSlider color='grey' defaultValue='60' val='140' />
              <Para variant='subtitle2'>Comments</Para>
              <ColorSlider color='primary' defaultValue='20' val='100' />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Top News</DialogTitle>
        <DialogContent>
          <TextField name="title" label="Title" fullWidth margin="dense" onChange={handleChange} />
          <TextField name="title2" label="Title 2" fullWidth margin="dense" onChange={handleChange} />
          <TextField name="content" label="Content" fullWidth margin="dense" multiline rows={4} onChange={handleChange} />
          <TextField name="author" label="Author" fullWidth margin="dense" onChange={handleChange} />
          <TextField name="approvedby" label="Approved By" fullWidth margin="dense" onChange={handleChange} />
          <TextField name="tags" label="Tags (comma-separated)" fullWidth margin="dense" onChange={handleChange} />
          <TextField name="top" label="Top (1 or 0)" type="number" fullWidth margin="dense" onChange={handleChange} />
          <TextField name="video" label="Video URL" fullWidth margin="dense" onChange={handleChange} />
          <TextField name="image" label="Image URL" fullWidth margin="dense" onChange={handleChange} />
          <TextField name="source" label="Source URL" fullWidth margin="dense" onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default AdminTopPanel;

