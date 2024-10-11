// theme.ts
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
        default: '#eaeaea'
      }
  },
  
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
        default: '#121212'
      }
  },
});

export { lightTheme, darkTheme };
