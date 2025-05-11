import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { colors } from '@mui/material';

const UploadButton = (props) => {
    const handleFileChange = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        console.log('Selected file:', files[0]);
        // Handle the file upload process here
      }
    };
  
    return (
      <label htmlFor="upload-file">
        <input
          id="upload-file"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          color={props.color}
          sx={props.sx}
        >
          {props.children}
        </Button>
      </label>
    );
  };


  UploadButton.propTypes ={
    color : PropTypes.string,
    children:PropTypes.string,
    sx:PropTypes.any
  }



  export default UploadButton