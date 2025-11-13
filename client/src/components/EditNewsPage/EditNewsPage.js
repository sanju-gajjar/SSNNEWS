import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    Snackbar,
    Chip,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import CategoryDropdown from '../CategoryDropdown';

function EditNewsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idFromQuery = params.get('id');
  const newsDataFromState = location.state?.newsData;
  const [formData, setFormData] = useState(newsDataFromState || {});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!newsDataFromState && idFromQuery) {
      setFetchLoading(true);
      const fetchNews = async () => {
        try {
          const response = await axiosInstance.get(`/news/${idFromQuery}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Failed to fetch news:', error);
          setMessage({ type: 'error', text: 'Failed to load news article' });
        } finally {
          setFetchLoading(false);
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
    
    if (!formData.title || !formData.content) {
      setMessage({ type: 'error', text: 'Title and content are required' });
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/news/${formData._id}/update`, formData);
      setMessage({ type: 'success', text: 'News article updated successfully!' });
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to update news:', error);
      setMessage({ type: 'error', text: 'Failed to update news article' });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/dashboard')}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Edit News Article
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update and manage your news article
          </Typography>
        </Box>
        <Chip label="Admin" color="primary" />
      </Box>

      {/* Form */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Main Title *
              </Typography>
              <TextField
                fullWidth
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="Enter news title"
                required
              />
            </Grid>

            {/* Secondary Title */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Secondary Title
              </Typography>
              <TextField
                fullWidth
                name="title2"
                value={formData.title2 || ''}
                onChange={handleChange}
                placeholder="Enter secondary title (optional)"
              />
            </Grid>

            {/* Content */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Content *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                name="content"
                value={formData.content || ''}
                onChange={handleChange}
                placeholder="Write your news content here..."
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Category
              </Typography>
              <CategoryDropdown
                value={formData.category || 'other'}
                onChange={(e) => handleChange({ target: { name: 'category', value: e.target.value } })}
              />
            </Grid>

            {/* Top Ten Position */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Top 10 Position (1-10)
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="topTenPosition"
                value={formData.topTenPosition || ''}
                onChange={handleChange}
                placeholder="Leave empty for regular news"
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>

            {/* Author */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Author
              </Typography>
              <TextField
                fullWidth
                name="author"
                value={formData.author || ''}
                onChange={handleChange}
                placeholder="Author name"
              />
            </Grid>

            {/* Approved By */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Approved By
              </Typography>
              <TextField
                fullWidth
                name="approvedby"
                value={formData.approvedby || ''}
                onChange={handleChange}
                placeholder="Approver name"
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Tags (comma separated)
              </Typography>
              <TextField
                fullWidth
                name="tags"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                onChange={handleChange}
                placeholder="e.g. politics, breaking news, gujarat"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Image URL */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Image URL
              </Typography>
              <TextField
                fullWidth
                name="image"
                value={formData.image || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <Box sx={{ mt: 2 }}>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} 
                  />
                </Box>
              )}
            </Grid>

            {/* Video URL */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Video URL
              </Typography>
              <TextField
                fullWidth
                name="video"
                value={formData.video || ''}
                onChange={handleChange}
                placeholder="YouTube video URL"
              />
            </Grid>

            {/* Source */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Source
              </Typography>
              <TextField
                fullWidth
                name="source"
                value={formData.source || ''}
                onChange={handleChange}
                placeholder="News source"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar for messages */}
      <Snackbar
        open={!!message.text}
        autoHideDuration={6000}
        onClose={() => setMessage({ type: '', text: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMessage({ type: '', text: '' })} 
          severity={message.type}
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditNewsPage;
