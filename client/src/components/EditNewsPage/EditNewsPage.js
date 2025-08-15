import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, TextField, Button, IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
function EditNewsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idFromQuery = params.get('id');
  const newsDataFromState = location.state?.newsData;
  const [formData, setFormData] = useState(newsDataFromState || {});
  const [previewImage, setPreviewImage] = useState('');
  const [previewLink, setPreviewLink] = useState('');

  useEffect(() => {
    // If no newsData in state and id in query, fetch news
    if (!newsDataFromState && idFromQuery) {
      const fetchNews = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/news/${idFromQuery}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Failed to fetch news:', error);
        }
      };
      fetchNews();
    }
  }, [newsDataFromState, idFromQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/news/${formData._id}/update`, formData);
      navigate('/admin');
    } catch (error) {
      console.error('Failed to update news:', error);
    }
  };

  const handlePreviewImage = () => {
    setPreviewImage(formData.image || '');
  };

  const handlePreviewLink = () => {
    setPreviewLink(formData.viewLink || '');
  };

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <h2>Edit News</h2>
      </Grid>
      {Object.keys(formData).map((key) => (
        <Grid item xs={12} key={key}>
          {key === 'content' ? (
            <TextField
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={6}
            />
          ) : key === 'image' ? (
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={11}>
                <TextField
                  label="Image URL"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={handlePreviewImage}>
                  <Visibility />
                </IconButton>
              </Grid>
              {previewImage && (
                <Grid item xs={12}>
                  <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                </Grid>
              )}
            </Grid>
          ) : key === 'viewLink' ? (
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={11}>
                <TextField
                  label="View Link"
                  name="viewLink"
                  value={formData.viewLink || ''}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={handlePreviewLink}>
                  <Visibility />
                </IconButton>
              </Grid>
              {previewLink && (
                <Grid item xs={12}>
                  <iframe src={previewLink} title="Preview" style={{ width: '100%', height: '300px' }} />
                </Grid>
              )}
            </Grid>
          ) : (
            <TextField
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              fullWidth
            />
          )}
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/admin')}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
}

export default EditNewsPage;
