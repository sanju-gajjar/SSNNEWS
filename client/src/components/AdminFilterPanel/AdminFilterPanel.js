import React, { useState, useEffect } from 'react';
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
  const [arrange, setArrange] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [newsList, setNewsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchNews(selectedDate);
  }, [selectedDate]);

  const fetchNews = async (date) => {
    try {
      const response = await axios.get(`${API_URL}/news`, { date });
      setNewsList(response.data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
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
    navigate('/edit-news', { state: { newsData: news } }); // Navigate to the edit page with news data
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/news/${id}`);
      fetchNews(selectedDate);
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ my: 2.3 }}>
        <Grid item xs={5}>
          <TextBox
            label="Search"
            variant="standard"
            fieldValue={inputValue}
            onFieldChanging={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <SelectBox
            placeholder="Category"
            defaultValue={category}
            menuItems={[] /* Replace with dynamic categories if needed */}
            handleChange={handleCategoryChange}
          />
        </Grid>
        <Grid item xs={3}>
          <SelectBox
            placeholder="Arrange By"
            defaultValue={arrange}
            menuItems={[
              { value: 'Oldest', label: 'Oldest' },
              { value: 'Newest', label: 'Newest' },
            ]}
            handleChange={handleArrange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextBox
            label="Select Date"
            type="date"
            fieldValue={selectedDate}
            onFieldChanging={handleDateChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {newsList.map((news) => (
          <Grid item xs={12} key={news._id}>
            <div>
              <h3>{news.title}</h3>
              <p>{news.content}</p>
              <Button variant="contained" color="primary" onClick={() => handleEdit(news)}>
                Edit
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleDelete(news._id)}>
                Delete
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default AdminFilterPanel;