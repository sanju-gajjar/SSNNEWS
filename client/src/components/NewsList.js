import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/news')
            .then(response => setNewsList(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleReadMore = (id) => {
        navigate(`/news/${id}`);
    };

    return (
        <div className="news-list">
            <ul className="news-list-container">
                {newsList.map(news => (
                    <li key={news._id} className="news-item">
                        <div className="news-thumbnail">
                            <img src={news.thumbnailUrl} alt={news.title} />
                            <span className="video-duration">{news.videoDuration}</span>
                        </div>
                        <div className="news-content">
                            <h2 className="news-title">{news.title}</h2>
                            <p className="news-summary">{news.content.substring(0, 100)}...</p>
                            <button className="read-more-button" onClick={() => handleReadMore(news._id)}>Read More</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewsList;
