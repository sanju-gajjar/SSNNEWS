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
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/news`)
            .then(response => setNewsList(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleReadMore = (id) => {
        navigate(`/news/${id}`);
    };

    return (
        <Box sx={{ width: '100%', px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 } }}>
            <LiveNews heading={'ઓપરેશન સિંદૂર વચ્ચે પીએમ મોદી રાત્રે 8 વાગ્યે રાષ્ટ્રને સંબોધિત કરશે'} />
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={8}>
                    <NewsHeading heading={'Technology'} />
                    <Grid container spacing={2}>
                        {newsList.slice(0, 6).map((news) => (
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
                                            {news &&  news.content && news.content.substring(0, 80)}...
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <NewsHeading heading={'Sports'} />
                    <SportsNews newList={newsList} handleReadMore={handleReadMore} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <NewsHeading heading={'Crime'} />
                    <CrimeNews newList={newsList} handleReadMore={handleReadMore} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default NewsList;
