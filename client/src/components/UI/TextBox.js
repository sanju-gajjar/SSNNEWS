import React from 'react';
import TextField from '@mui/material/TextField';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)({

    '&.textBoxBasic':{
        width:'100% !important',
    },

  "& label.Mui-focused": {
    color: "black",
  },
  "& .MuiInput-underline": {
    width:'100%',
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
    "& input": {
      color: "black",
      
    },
  },
});


function shouldDisplayError(showError, errorText) {
    return showError && errorText !== '';
  }
function TextBox(props){
    
    return(
        <CustomTextField  
        label={parse(props.label)} 
        className={`textBoxBasic ${props.className}`}
         variant={`${
            props.className === 'borderBox' ? 'outlined' : 'standard'
          }`}
          autoComplete='off'
          sx={props.sx}
          name={props.name}
          InputProps ={{...props.InputProps}}
          id={props.id}
          value={(props.fieldValue || '')}
          type={(props.type)}
          onChange={props.onFieldChanging}
          onBlur={props.onBlur ? props.onBlur : props.onFieldChanged}
          onFocus={props.onInputFocus}
          onKeyDown={props.keyDown}
          autoFocus={props.autoFocus}
          disabled={props.isReadOnly}
          error={!!shouldDisplayError(props.showError, props.errorText)}
          helperText={shouldDisplayError(props.showError, props.errorText) === true
            ? props.errorText
            : ''
      }
         />

    );    
}



TextBox.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    sx: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    fieldValue: PropTypes.string,
    type:PropTypes.string,
    placeholder: PropTypes.string,
    onFieldChanging: PropTypes.func,
    onFieldChanged: PropTypes.func,
    onInputFocus: PropTypes.func,
    InputProps: PropTypes.object,
    keyDown: PropTypes.func,
    autoFocus: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    showError: PropTypes.bool,
  };
export default TextBox;