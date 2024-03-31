import { ExpandLessTwoTone, ExpandMoreTwoTone } from '@mui/icons-material';
import { Box, Collapse, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface DevInfoProps {
  devView: boolean;
  handleDevView: (flag: boolean) => void;
}
const DevInfo = (props: DevInfoProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flex: props.devView ? 0.25 : 0,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          borderLeft: `3px solid ${theme.palette.primary.main}`,
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
            props.handleDevView(!props.devView);
          }}
        >
          {props.devView ? (
            <ExpandMoreTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          ) : (
            <ExpandLessTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          )}
        </IconButton>
      </Box>
      <Collapse
        in={props.devView}
        orientation="horizontal"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90%',
          paddingX: props.devView ? '.5rem' : 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflowY: 'auto',
            height: '100%',
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
            Dev Info
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
};
export default DevInfo;
