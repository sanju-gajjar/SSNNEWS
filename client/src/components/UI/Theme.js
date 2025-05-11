import React from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeGenerator = () => {
  
  return  createTheme({
    cssVarPrefix: '',
    cssVariables: true,
    palette: {
        common: {            
            gray:'#625b5b',
            white: '#fff',
            black: '#010101',
            textLight: '',
            textDark:'',
            bgColorLight: '',
          },
          primary: {
            main: '#ea9809',        
            mid: '#df7d17',
            contrastText:'#fff'
          },
          secondary: {
            main: '#95af0f',
            light: '#a8c772',
          },
    },
    typography: {
        htmlFontSize: 16,
        fontFamily: `Roboto`,
        fontSize: 14,
        h1: {
          fontSize: '2rem',
          fontWeight: 700,
        },

        h2: {
          fontSize: '1.75rem',
          fontWeight: 600,
        },

        h3: {
          fontSize: '1.5rem',
          fontWeight: 500,
        },
        h4: {
          fontSize: '1.313rem', // 21px
        },
        h5: {
          fontSize: '1.188rem', // 19px
        },
        h6: {
          fontSize: '1.063rem', // 17px
        },

        subtitle1: {
          fontSize: '1rem',
        },
        subtitle2: {
          fontSize: '0.875rem',
        },
        body1: {
          fontSize: '0.8125rem', // 13px
        },

        body2: {
          fontSize: '0.75rem', // 12px
        },

        caption: {
          fontSize: '0.7rem', // 11px
        },
      },
  })
}
