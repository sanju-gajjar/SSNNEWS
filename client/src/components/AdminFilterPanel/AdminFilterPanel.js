import React from 'react'
import SelectBox from '../UI/SelectBox'
import { useState } from 'react';
import TextBox from '../UI/TextBox';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Grid } from '@mui/material';

const options = [
  { value: 'Top Newa', label: 'Top News' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Bollywood', label: 'Bollywood' },
  { value: 'Education', label: 'Education' },
  { value: 'Business', label: 'Business' },
  { value: 'Life Styles', label: 'lifeStyles' },
  { value: 'Knowledge News', label: 'Knowledge' },
  { value: 'Crime News', label: 'Crime' },
  { value: 'World News', label: 'World' },
  // Add more options as needed
];

const arrangeBy = [
  {value:'Oldest', label:'Oldest'},
  {value:'Newest', label:'Newest'}
]

function AdminFilterPanel({category, onCategoryChange})  {

const [arrange,setArrange] = useState('');
const [inputValue, setInputValue] = useState('');

const handleInputChange = (event) => {
  setInputValue(event.target.value);
};

const handleArrange = (e) => {
  setArrange(e.target.value)
}
 
const handleCategoryChange = (event) => {
  onCategoryChange(event.target.value);
};
  return (
    <>

    <Grid container spacing={2} sx={{my:2.3}}>
      <Grid size={5}>
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
    <Grid size={4}>
      <SelectBox placeholder ='Category'
       defaultValue={category}
        menuItems={options}
          handleChange={handleCategoryChange}>
        
      </SelectBox>
</Grid>

<Grid size={3}>
      <SelectBox placeholder ='Arrange By'
       defaultValue={arrange}
        menuItems={arrangeBy}
          handleChange={handleArrange}>
        
      </SelectBox>
</Grid>
      </Grid>
    </>
  )
}

export default AdminFilterPanel