import { useDispatch, useSelector } from 'react-redux';
import { ExpandLessTwoTone, ExpandMoreTwoTone } from '@mui/icons-material';
import { Box, IconButton, useTheme } from '@mui/material';
import useIsMobile from '@/app/customHooks/useIsMobile';
import {
  getUserView,
  getWeatherView,
  toggleUserView,
  toggleWeatherView,
} from '@/app/appSlice';

interface TrayHandleProps {
  side: 'l' | 'r';
}

const TrayHandle = (props: TrayHandleProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const { view, transform, action, border } = {
    l: {
      view: useSelector(getWeatherView),
      transform: 'rotate(90deg)',
      action: toggleWeatherView,
      border: 'borderLeft',
    },
    r: {
      view: useSelector(getUserView),
      transform: 'rotate(-90deg)',
      action: toggleUserView,
      border: 'borderRight',
    },
  }[props.side];

  return (
    <Box
      sx={{
        [border]: `3px solid ${theme.palette.primary.main}`,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        width: isMobile && view ? 0 : 'unset',
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
          dispatch(action());
        }}
      >
        {view ? (
          <ExpandMoreTwoTone sx={{ transform }} />
        ) : (
          <ExpandLessTwoTone sx={{ transform }} />
        )}
      </IconButton>
    </Box>
  );
};

export default TrayHandle;
