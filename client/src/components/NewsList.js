// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const NewsList = () => {
//     const [newsList, setNewsList] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         axios.get('https://ssnnewsserver.onrender.com/news')
//             .then(response => setNewsList(response.data))
//             .catch(error => console.error(error));
//     }, []);

//     const handleReadMore = (id) => {
//         navigate(`/news/${id}`);
//     };

//     return (
//         <div className="news-list">
//             <ul className="news-list-container">
//                 {newsList.map(news => (
//                     <li key={news._id} className="news-item">
//                         <div className="news-thumbnail">
//                             <img src={news.thumbnailUrl} alt={news.title} />
//                             <span className="video-duration">{news.videoDuration}</span>
//                         </div>
//                         <div className="news-content">
//                             <h2 className="news-title">{news.title}</h2>
//                             <p className="news-summary">{news.content.substring(0, 100)}...</p>
//                             <button className="read-more-button" onClick={() => handleReadMore(news._id)}>Read More</button>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default NewsList;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewsUI.css';
import LiveNews from './LiveNews';
import NewsHeading from './NewsHeading';
import TechNews from './TechNews';
import CrimeNews from './CrimeNews';
import SportsNews from './SportsNews';
import { Box, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

const NewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const [externalNews, setExternalNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/news`)
            .then(response => setNewsList(response.data))
            .catch(error => console.error(error));

        // Fetch external news
        axios.post(`${API_URL}/external-news/fetch-and-store`)
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
        <Box sx={{ width: '100%', px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 } }}>
           


            {/* Main News Section */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={8}>
                    <NewsHeading heading={'Technology'} />
                    <Grid container spacing={2}>
                        {sortedNewsList.slice(0, 100).map((news) => (
                            <Grid item xs={12} sm={6} key={news._id}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        boxShadow: 2,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'scale(1.03)' }
                                    }}
                                    onClick={() => handleReadMore(news._id)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={news.image}
                                        alt={news.title}
                                        sx={{ borderRadius: '12px 12px 0 0' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                            {news.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {news && news.content && news.content.substring(0, 80)}...
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <NewsHeading heading={'Sports'} />
                    <SportsNews newList={sortedNewsList} handleReadMore={handleReadMore} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <NewsHeading heading={'Crime'} />
                    <CrimeNews newList={sortedNewsList} handleReadMore={handleReadMore} />
                </Grid>
            </Grid>
                

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
