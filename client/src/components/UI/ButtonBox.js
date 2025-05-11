import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'

function ButtonBox(props) {
  return (
    <Button 
      type={props.type}
      value={props.value}
      variant={props.variant}
      onClick={props.onClick}
      sx={props.sx}
      name={props.name}
      className={props.className}
      fullWidth ={props.fullWidth}
      color={props.color}
      size='small'
      >
        {props.placeholder}
        </Button>
  )
}

Button.defaultProps = {
    fullWidth: false,
    disabled: false,
    color: 'primary',
    variant:'contained'
  };


ButtonBox.propTypes = {
    type:PropTypes.string,
    value:PropTypes.string,
    className: PropTypes.string,
    sx:PropTypes.string,
    name:PropTypes.string,
    variant:PropTypes.string,
    color:PropTypes.string,
    onClick:PropTypes.func,
    fullWidth:PropTypes.string,
    placeholder:PropTypes.string

}

export default ButtonBox
