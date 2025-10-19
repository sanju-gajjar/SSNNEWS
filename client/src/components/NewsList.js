import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './NewsUI.css';
import LiveNews from './LiveNews';
import NewsHeading from './NewsHeading';
import TechNews from './TechNews';
import CrimeNews from './CrimeNews';
import SportsNews from './SportsNews';
import EnhancedNewsCard from './EnhancedNewsCard';
import ModernNewsCard from './ModernNewsCard/ModernNewsCard';
import WeatherWidget from './widgets/WeatherWidget';
import HoroscopeWidget from './widgets/HoroscopeWidget';
import GoldRatesWidget from './widgets/GoldRatesWidget';
import CricketWidget from './widgets/CricketWidget';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Container } from '@mui/material';

// Using axiosInstance instead of API_URL

const NewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const [externalNews, setExternalNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get(`/news`)
            .then(response => setNewsList(response.data))
            .catch(error => console.error(error));

        // Fetch external news
        axiosInstance.post(`/external-news/fetch-and-store`)
            .then(response => setExternalNews(response.data.news || []))
            .catch(error => console.error(error));
    }, []);

    const handleReadMore = (id) => {
        navigate(`/news/${id}`);
    };

    // Sort newsList by createdAt (latest first)
    const sortedNewsList = [...newsList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestNews = sortedNewsList.length > 0 ? sortedNewsList[0] : null;

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            pb: 8 // Extra padding for mobile navigation
        }}>
            <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 }, py: { xs: 2, sm: 3 } }}>
                {/* Hero Section - Latest News */}
                {sortedNewsList.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 3,
                                fontWeight: 800,
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center'
                            }}
                        >
                            Latest News
                        </Typography>
                        
                        <Grid container spacing={3}>
                            {sortedNewsList.slice(0, 6).map((news, index) => (
                                <Grid item xs={12} sm={6} lg={4} key={news._id}>
                                    <ModernNewsCard
                                        news={news}
                                        onClick={() => handleReadMore(news._id)}
                                        animationDelay={index * 0.1}
                                        onShare={(newsItem) => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: newsItem.title,
                                                    text: newsItem.content?.substring(0, 100),
                                                    url: window.location.origin + `/news/${newsItem._id}`
                                                });
                                            }
                                        }}
                                        onBookmark={(newsItem) => {
                                            console.log('Bookmark news:', newsItem._id);
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Weather Widget Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3,
                            fontWeight: 700,
                            color: '#333',
                            textAlign: 'center'
                        }}
                    >
                        Gujarat Weather
                    </Typography>
                    <WeatherWidget language="gujarati" compact={false} />
                </Box>

                {/* Horoscope Widget Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3,
                            fontWeight: 700,
                            color: '#333',
                            textAlign: 'center'
                        }}
                    >
                        Daily Horoscope
                    </Typography>
                    <HoroscopeWidget language="gujarati" compact={false} />
                </Box>

                {/* Gold Rates Widget Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3,
                            fontWeight: 700,
                            color: '#333',
                            textAlign: 'center'
                        }}
                    >
                        Gold & Silver Rates
                    </Typography>
                    <GoldRatesWidget language="gujarati" compact={false} />
                </Box>

                {/* Cricket Live Updates Widget Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3,
                            fontWeight: 700,
                            color: '#333',
                            textAlign: 'center'
                        }}
                    >
                        Cricket Live Updates
                    </Typography>
                    <CricketWidget />
                </Box>

                {/* More News Section */}
                {sortedNewsList.length > 6 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mb: 3,
                                fontWeight: 700,
                                color: '#333',
                                textAlign: 'center'
                            }}
                        >
                            More Stories
                        </Typography>
                        
                        <Grid container spacing={3}>
                            {sortedNewsList.slice(6, 20).map((news, index) => (
                                <Grid item xs={12} sm={6} lg={4} key={news._id}>
                                    <ModernNewsCard
                                        news={news}
                                        onClick={() => handleReadMore(news._id)}
                                        animationDelay={(index + 6) * 0.05}
                                        onShare={(newsItem) => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: newsItem.title,
                                                    text: newsItem.content?.substring(0, 100),
                                                    url: window.location.origin + `/news/${newsItem._id}`
                                                });
                                            }
                                        }}
                                        onBookmark={(newsItem) => {
                                            console.log('Bookmark news:', newsItem._id);
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Category Sections */}
                <Box sx={{ mb: 4 }}>
                    <NewsHeading heading={'Sports'} />
                    <SportsNews newList={sortedNewsList} handleReadMore={handleReadMore} />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <NewsHeading heading={'Crime'} />
                    <CrimeNews newList={sortedNewsList} handleReadMore={handleReadMore} />
                </Box>
            </Container>
                

{externalNews.length > 0 && (
  <Box sx={{ mb: 4 }}>
    <NewsHeading heading={'External Top News'} />
    <Grid
      container
      spacing={2}
      sx={{
        overflowX: 'auto',
        flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' },
        pb: 2,
        px: 1,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {externalNews.slice(0, 50).map((n, idx) => (
        (n.image_url || n.image) && (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={n.article_id || idx}
            sx={{ minWidth: { xs: '100%', sm: 320 }, maxWidth: 400, mx: 'auto' }}
          >
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={n.image_url || n.image}
                  alt={n.title}
                  sx={{ borderRadius: '16px 16px 0 0', objectFit: 'cover' }}
                />
                {n.video_url && (
                  <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', borderRadius: '50%', p: 1 }}>
                    <span role="img" aria-label="video" style={{ color: '#fff', fontSize: 22 }}>▶️</span>
                  </Box>
                )}
                {n.duplicate && (
                  <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                    <span role="img" aria-label="duplicate" style={{ color: '#f44336', fontSize: 22 }}>⚠️</span>
                  </Box>
                )}
              </Box>
              <CardContent sx={{ flex: 1, p: 2 }}>
                {/* Hide fields containing 'PLANS' (case-insensitive) */}
                {n.title && !/plans/i.test(n.title) && (
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5, lineHeight: 1.3 }}>
                    {n.title}
                  </Typography>
                )}
                {(n.description && !/plans/i.test(n.description)) || (n.content && !/plans/i.test(n.content)) ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {n.description && !/plans/i.test(n.description)
                      ? (n.description.length > 80 ? n.description.substring(0, 80) + '...' : n.description)
                      : n.content && !/plans/i.test(n.content)
                        ? (n.content.length > 80 ? n.content.substring(0, 80) + '...' : n.content)
                        : ''}
                  </Typography>
                ) : null}
                {n.ai_summary && !/plans/i.test(n.ai_summary) && (
                  <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontStyle: 'italic' }}>
                    {n.ai_summary.length > 80 ? n.ai_summary.substring(0, 80) + '...' : n.ai_summary}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {Array.isArray(n.keywords) && n.keywords.filter(kw => !/plans/i.test(kw)).map((kw, i) => (
                    <span key={i} style={{ background: '#e3f2fd', borderRadius: 8, padding: '2px 8px', fontSize: '0.8rem', marginRight: 4 }}>{kw}</span>
                  ))}
                  {Array.isArray(n.category) && n.category.filter(cat => !/plans/i.test(cat)).map((cat, i) => (
                    <span key={i} style={{ background: '#fce4ec', borderRadius: 8, padding: '2px 8px', fontSize: '0.8rem', marginRight: 4 }}>{cat}</span>
                  ))}
                  {Array.isArray(n.country) && n.country.filter(ct => !/plans/i.test(ct)).map((ct, i) => (
                    <span key={i} style={{ background: '#e8f5e9', borderRadius: 8, padding: '2px 8px', fontSize: '0.8rem', marginRight: 4 }}>{ct}</span>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {n.source_icon && !/plans/i.test(n.source_icon) && (
                    <Box component="img" src={n.source_icon} alt={n.source_name} sx={{ width: 24, height: 24, mr: 1, borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                  {n.source_name && !/plans/i.test(n.source_name) && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {n.source_name}
                    </Typography>
                  )}
                  {n.source_url && !/plans/i.test(n.source_url) && (
                    <a href={n.source_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, color: '#1976d2', fontSize: '0.8rem' }}>Source</a>
                  )}
                </Box>
                {(n.pubDate && !/plans/i.test(n.pubDate)) || (n.pubDateTZ && !/plans/i.test(n.pubDateTZ)) ? (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {n.pubDate && !/plans/i.test(n.pubDate) ? new Date(n.pubDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                    {n.pubDateTZ && !/plans/i.test(n.pubDateTZ) ? ` (${n.pubDateTZ})` : ''}
                  </Typography>
                ) : null}
                {Array.isArray(n.creator) && n.creator.filter(c => !/plans/i.test(c)).length > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    By {n.creator.filter(c => !/plans/i.test(c)).join(', ')}
                  </Typography>
                )}
                {n.sentiment && !/plans/i.test(n.sentiment) && (
                  <span style={{
                    background: n.sentiment === 'positive' ? '#c8e6c9' : n.sentiment === 'negative' ? '#ffcdd2' : '#fffde7',
                    color: '#333',
                    borderRadius: 8,
                    padding: '2px 8px',
                    fontSize: '0.8rem',
                    marginRight: 4,
                    fontWeight: 600,
                  }}>{n.sentiment}</span>
                )}
                {n.ai_tag && !/plans/i.test(n.ai_tag) && (
                  <span style={{ background: '#ede7f6', borderRadius: 8, padding: '2px 8px', fontSize: '0.8rem', marginRight: 4 }}>{n.ai_tag}</span>
                )}
                {n.ai_region && !/plans/i.test(n.ai_region) && (
                  <span style={{ background: '#fff3e0', borderRadius: 8, padding: '2px 8px', fontSize: '0.8rem', marginRight: 4 }}>{n.ai_region}</span>
                )}
                {n.ai_org && !/plans/i.test(n.ai_org) && (
                  <span style={{ background: '#e0f7fa', borderRadius: 8, padding: '2px 8px', fontSize: '0.8rem', marginRight: 4 }}>{n.ai_org}</span>
                )}
              </CardContent>
              <Box sx={{ p: 2, pt: 0, textAlign: 'right', minHeight: 32 }}>
                <a
                  href={n.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: n.link ? '#1976d2' : '#aaa',
                    textDecoration: n.link ? 'underline' : 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    pointerEvents: n.link ? 'auto' : 'none',
                    opacity: n.link ? 1 : 0.5,
                  }}
                >
                  Read Full Story →
                </a>
              </Box>
            </Card>
          </Grid>
        )
      ))}
    </Grid>
  </Box>
)}
        </Box>
    );
};

export default NewsList;
