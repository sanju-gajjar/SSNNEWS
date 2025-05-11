import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

function Para({children,...props}) {
  return (
    <Typography 
    variant={props.variant}
    sx={props.sx}
    align={props.align}
    className={props.className}
    color={props.color}
    id={props.id}>{children}</Typography>
  )
}
Typography.defaultProps ={

};



Para.propTypes = {
  children:PropTypes.any,
    variant: PropTypes.string,
    sx:PropTypes.string,
    align:PropTypes.string,
    className:PropTypes.string,
    color:PropTypes.string,
    id:PropTypes.string,
    text:PropTypes.string
}


export default Para