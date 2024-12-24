// styles.ts
import { Theme } from '@mui/material/styles';

export const getStyles = (theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  form: {
    width: 500,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: 4,
    boxShadow: theme.shadows[6],
    color: theme.palette.text.primary,
    border: `1px solid rgba(255, 255, 255, 0.6)`,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  link: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.primary.dark,
    },
  },
  input: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.grey[400],
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.dark,
      },
    },
  },
  forgotPassword: {
    display: 'block',
    marginBottom: 3,
    textAlign: 'right',
    color: theme.palette.text.secondary,
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.primary.main,
    },
  },
  signInButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1.2rem',
    padding: '12px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  bottomText: {
    marginTop: 3,
    color: theme.palette.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
