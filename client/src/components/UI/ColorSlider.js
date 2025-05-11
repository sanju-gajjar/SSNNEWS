import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

export default function ColorSlider(props) {
  return (
    <Box sx={{ width:'98%', display:'flex',alignItems:'center',gap:2 }}>
      <Slider
        aria-label="Temperature"
        defaultValue={props.defaultValue}
        getAriaValueText={valuetext}
        color={props.color}
      />
      <span>{props.val}</span>
    </Box>
  );
}


ColorSlider.propTypes = {
  color : PropTypes.string,
  defaultValue:PropTypes.number,
  val:PropTypes.any
}