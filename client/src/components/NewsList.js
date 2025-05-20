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
import  './NewsUI.css';
import LiveNews from './LiveNews';
import NewsHeading from './NewsHeading';
import TechNews from './TechNews';
import CrimeNews from './CrimeNews';
import SportsNews from './SportsNews';

const NewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/news`)
            .then(response => setNewsList(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleReadMore = (id) => {
        navigate(`/news/${id}`);
    };

    return (
        <>
        <div className="news-list">
            <div className='news-left-section'>
            <LiveNews heading={'ઓપરેશન સિંદૂર વચ્ચે પીએમ મોદી રાત્રે 8 વાગ્યે રાષ્ટ્રને સંબોધિત કરશે'}/>
           <TechNews newList={newsList} handleReadMore={handleReadMore}/>
              <SportsNews newList={newsList} handleReadMore={handleReadMore}/>
           </div>
           <div className='news-right-section'>           
                <CrimeNews newList={newsList} handleReadMore={handleReadMore}/>             
            </div>

             
        </div>
                
        </>
    );
};

export default NewsList;
