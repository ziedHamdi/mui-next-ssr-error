import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 500,//600
            md: 940,//900
            lg: 1200,//1200
            xl: 1600,//1536
        },
    },
    palette: {
        primary: {
            // main: '#518FED',
            main: '#3875d4',
            layer:'#042283'
        },
        secondary: {
            main: '#20409f',
        },
        capital: {
            main: '#34d178',
            dark: '#037936'
        },
        error: {
            // main: '#fc0031',
            main: '#ca0000',
        },
        warn: {
            main: '#f3be2b',
        },
        background: {
            default: '#ecf0f2',
            dark: '#e3eaef',
            light: '#e0e0e0',
            lighter: '#eaf0f4'
        },
        text: {
            red: '#ca0000',
            warn: '#d59f00',
            primary: '#333333'
        }
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            'Open Sans',
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    overrides: {
        MuiFilledInput: {
            root: {
                backgroundColor: 'rgba(0,0,0,0.02)',
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.07)',
                }
            },
        },
    },

});

theme.typography.body1 = {
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}
theme.typography.body2 = {
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}
theme.typography.caption = {
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}
theme.typography.h6 = {
    fontSize: '1.1rem',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.9rem',
    },
}

export default theme;