import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, CardActions, Typography, Tooltip, Fade, Box, Avatar } from '@mui/material';
import SelectBox from '../UI/SelectBox';
import TextBox from '../UI/TextBox';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Grid, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function AdminFilterPanel({ category, onCategoryChange }) {
  const navigate = useNavigate();
  const [arrange, setArrange] = useState('Newest');
  const [inputValue, setInputValue] = useState('');
  const [newsList, setNewsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews(selectedDate);
  }, [selectedDate]);

  const fetchNews = async (date) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/news`, { date });
      setNewsList(response.data);
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) setError('No news found for selected date.');
    } catch (err) {
      setError('Failed to fetch news.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleArrange = (e) => {
    setArrange(e.target.value);
  };

  const handleCategoryChange = (event) => {
    onCategoryChange(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleEdit = (news) => {
    navigate('/edit-news', { state: { newsData: news } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/news/${id}`);
      fetchNews(selectedDate);
    } catch (error) {
      setError('Failed to delete news.');
    }
  };

  // Sort newsList by createdAt in descending order (latest first)
  const sortedNewsList = [...newsList].sort(
    arrange === 'Oldest'
      ? (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      : (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Styled components
  const NewsCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    borderRadius: 16,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    },
    background: '#fff',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 260,
    boxSizing: 'border-box',
  }));

  const PreviewImg = styled('img')({
    width: 80,
    height: 60,
    objectFit: 'cover',
    borderRadius: 8,
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
    background: '#f5f5f5',
  });

  const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    fontSize: 14,
    color: '#555',
    wordBreak: 'break-word',
  }));

  const PreviewVideo = styled('video')({
    width: 80,
    height: 60,
    borderRadius: 8,
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
    background: '#f5f5f5',
  });

  // Detect mobile device for responsive video height
  const isMobile = window.innerWidth < 600;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1976d2', textAlign: 'center', letterSpacing: 1 }}>
        Manage News
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center', justifyContent: 'center' }}>
        <Grid item xs={12} sm={5}>
          <TextBox
            label="Search News"
            variant="outlined"
            fieldValue={inputValue}
            onFieldChanging={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ background: '#fff', borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SelectBox
            placeholder="Category"
            defaultValue={category}
            menuItems={[]}
            handleChange={handleCategoryChange}
            sx={{ background: '#fff', borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <SelectBox
            placeholder="Arrange By"
            defaultValue={arrange}
            menuItems={[
              { value: 'Oldest', label: 'Oldest' },
              { value: 'Newest', label: 'Newest' },
            ]}
            handleChange={handleArrange}
            sx={{ background: '#fff', borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextBox
            label="Date"
            type="date"
            fieldValue={selectedDate}
            onFieldChanging={handleDateChange}
            sx={{ background: '#fff', borderRadius: 2 }}
          />
        </Grid>
      </Grid>
      {loading ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>Loading news...</Typography>
      ) : error ? (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>
      ) : !sortedNewsList || sortedNewsList.length === 0 ? (
        <Fade in={true}><Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>No news found. Try another date or filter.</Typography></Fade>
      ) : (
        <Grid container spacing={3}>
          {sortedNewsList
            .filter(news =>
              (news.title && typeof news.title === 'string' && news.title.toLowerCase().includes(inputValue.toLowerCase())) ||
              (news.content && typeof news.content === 'string' && news.content.toLowerCase().includes(inputValue.toLowerCase()))
            )
            .map((news) => (
            <Grid item xs={12} sm={6} md={4} key={news._id} sx={{ display: 'flex' }}>
              <Fade in={true} timeout={400}>
                <NewsCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      {news.image ? (
                        <PreviewImg src={news.image} alt="news" />
                      ) : news.video ? (
                        <Avatar sx={{ width: 80, height: 60, bgcolor: '#eee', color: '#888', fontSize: 32 }}>N</Avatar>
                      ) : (
                        <Avatar sx={{ width: 80, height: 60, bgcolor: '#eee', color: '#888', fontSize: 32 }}>N</Avatar>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 0.5, whiteSpace: 'normal', wordBreak: 'break-word' }}>{news.title}</Typography>
                        {news.title2 && (
                          <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 500, whiteSpace: 'normal', wordBreak: 'break-word' }}>{news.title2}</Typography>
                        )}
                        {/* <Typography variant="body2" sx={{ color: '#666', whiteSpace: 'normal', wordBreak: 'break-word' }}>{news.category || 'General'}</Typography> */}
                      </Box>
                    </Box>
                    <InfoRow>
                      <strong>Author:</strong> {news.author || 'Unknown'}
                      <strong>Approved By:</strong> {news.approvedby || 'N/A'}
                      <strong>Likes:</strong> {typeof news.likes === 'number' ? news.likes : 0}
                      <strong>Top:</strong> {news.top || '-'}
                    </InfoRow>
                    <InfoRow>
                      <strong>Tags:</strong> {Array.isArray(news.tags) ? news.tags.join(', ') : ''}
                    </InfoRow>
                    <InfoRow>
                      <strong>Source:</strong> <a href={news.source} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>{news.source}</a>
                    </InfoRow>
                    <Typography variant="body2" sx={{ color: '#444', mb: 1, minHeight: 48, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                      {news.content}
                    </Typography>
                    {news.video && (
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <iframe
                          width="100%"
                          height={isMobile ? 200 : 350}
                          src={`https://www.youtube.com/embed/${(() => {
                            const url = news.video;
                            const match = url.match(/(?:v=|\/embed\/|\/live\/|\/shorts\/|\/watch\?v=)([A-Za-z0-9_-]{11})/);
                            if (match && match[1]) return match[1];
                            const parts = url.split('/');
                            const last = parts[parts.length - 1];
                            return last.length === 11 ? last : url;
                          })()}?autoplay=1`}
                          title="YouTube video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ borderRadius: 16, boxShadow: 2 }}
                        />
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Tooltip title="Edit this news" arrow>
                      <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(news)} sx={{ borderRadius: 2, fontWeight: 600 }}>
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete this news" arrow>
                      <Button variant="contained" color="error" size="small" onClick={() => handleDelete(news._id)} sx={{ borderRadius: 2, fontWeight: 600 }}>
                        Delete
                      </Button>
                    </Tooltip>
                  </CardActions>
                </NewsCard>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default AdminFilterPanel;