import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { categoryMap } from '../i18n/gujaratiTranslations';

const CategoryDropdown = ({ value, onChange, name = "category", label = "Category / શ્રેણી", required = false }) => {
    const categories = Object.entries(categoryMap);

    return (
        <FormControl fullWidth required={required}>
            <InputLabel>{label}</InputLabel>
            <Select
                name={name}
                value={value || ''}
                onChange={onChange}
                label={label}
                sx={{ fontFamily: 'Noto Sans Gujarati, sans-serif' }}
            >
                {categories.map(([key, gujaratiLabel]) => (
                    <MenuItem 
                        key={key} 
                        value={key}
                        sx={{ fontFamily: 'Noto Sans Gujarati, sans-serif' }}
                    >
                        {gujaratiLabel} ({key})
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CategoryDropdown;
