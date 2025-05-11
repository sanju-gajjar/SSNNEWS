import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import NativeSelect from '@mui/material/NativeSelect';

export default function SelectBox(props) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor={`${props.id}-select`}>
        {props.placeholder}

        </InputLabel>
        <NativeSelect
          defaultValue={30}
          labelId={`${props.id}-label`}
          id={props.id}
          onChange={props.handleChange}
          value={props.defaultValue}
          name={props.name}
          className={props.className}
          
          inputProps={{
            
            id: 'uncontrolled-native',
          }}
        >

            {props.menuItems  && props.menuItems.length > 0 &&
             props.menuItems.map((e,index) => (
                <option key={index}
                 value={e.value}
                
                 >
                    {e.label}</option>
             ))}
          
      
        </NativeSelect>
      </FormControl>
    </Box>
  );
}

SelectBox.propTypes = {
    placeholder: PropTypes.string,
    id: PropTypes.string,
    handleChange: PropTypes.func,
    name: PropTypes.string,
    className: PropTypes.string,
    menuItems: PropTypes.array,
    endAdornment:PropTypes.string,
    clearValue:PropTypes.func
  };
  
