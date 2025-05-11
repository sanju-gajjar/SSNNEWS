import React from 'react'
import Para from '../UI/Para'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles';


function HeadigBox(props) {
    const theme = useTheme();
  return (
    <div>
    <Para variant='h4' color='grey' sx={{my:2.2, borderLeft:`10px solid ${theme.palette.secondary.main}`,p:1}}  >
        {props.heading}</Para>
    </div>
  )
}

HeadigBox.propTypes ={
    heading: PropTypes.string
}

export default HeadigBox