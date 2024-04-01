import { ExpandLessTwoTone, ExpandMoreTwoTone } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Typography,
  IconButton,
  OutlinedInput,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

interface UserPreferencesProps {
  userView: boolean;
  handleUserView: (flag: boolean) => void;
  handleSetLocation: (str: string) => void;
}

const UserPreferences = (props: UserPreferencesProps) => {
  const theme = useTheme();
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  return (
    <Box
      sx={{
        display: 'flex',
        flex: props.userView ? 0.25 : 0,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          borderRight: `3px solid ${theme.palette.primary.main}`,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          sx={{
            padding: '.5rem',
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => {
            props.handleUserView(!props.userView);
          }}
        >
          {props.userView ? (
            <ExpandMoreTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          ) : (
            <ExpandLessTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          )}
        </IconButton>
      </Box>
      <Collapse
        in={props.userView}
        orientation="horizontal"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90%',
          paddingX: props.userView ? '.5rem' : 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              borderBottom: `3px solid ${theme.palette.primary.main}`,
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            User Preferences
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            border: '1px solid black',
            flexDirection: 'column',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              props.handleSetLocation(`${city},${state},USA`);
              setCity('');
              setState('');
            }}
          >
            <OutlinedInput
              type="text"
              value={city}
              placeholder="City"
              fullWidth
              inputProps={{
                sx: {
                  textAlign: 'center',
                },
              }}
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />
            <OutlinedInput
              type="text"
              value={state}
              placeholder="State Abbr"
              fullWidth
              inputProps={{
                maxLength: 2,
                sx: {
                  textAlign: 'center',
                },
              }}
              onChange={(e) => {
                setState(e.target.value.toUpperCase());
              }}
            />
            <OutlinedInput
              type="submit"
              fullWidth
              inputProps={{ sx: { cursor: 'pointer' } }}
            />
          </form>
        </Box>
      </Collapse>
    </Box>
  );
};
export default UserPreferences;
