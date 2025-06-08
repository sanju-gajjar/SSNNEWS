import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [selectedDate]);

  useEffect(() => {
    const uniqueTags = [...new Set(news.map(item => item.tag))];
    setCategories(uniqueTags);
  }, [news]);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`/api/news?date=${selectedDate.toISOString().split('T')[0]}`);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      await axios.put(`/api/news/${updatedData.id}`, updatedData);
      fetchNews(); // Refresh news list
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  return (
    <div>
      <div>
        <label>Category:</label>
        <select>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>
      <ul>
        {news.map(item => (
          <li key={item.id}>
            <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px' }} />
            <span>{item.title}</span>
            <button onClick={() => setPopupData(item)}>Edit</button>
          </li>
        ))}
      </ul>
      {popupData && (
        <div className="popup">
          <h3>Edit News</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit(popupData);
              setPopupData(null);
            }}
          >
            <label>Title:</label>
            <input
              type="text"
              value={popupData.title}
              onChange={(e) => setPopupData({ ...popupData, title: e.target.value })}
            />
            <label>Tag:</label>
            <input
              type="text"
              value={popupData.tag}
              onChange={(e) => setPopupData({ ...popupData, tag: e.target.value })}
            />
            <button type="submit">Save</button>
            <button onClick={() => setPopupData(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewsList;
