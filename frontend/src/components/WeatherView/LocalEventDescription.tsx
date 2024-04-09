import { Box, Chip, Typography } from '@mui/material';

interface LocalEventDescriptionProps {
  formattedDateRange: string;
  venue: { name: string; address: string } | undefined;
  topics: { edges: { cursor: string; node: { name: string } }[] };
  description: string;
  scrollComponent: React.MutableRefObject<HTMLElement | undefined>;
  scrollXComponent: React.MutableRefObject<HTMLElement | undefined>;
}

const LocalEventDescription = (props: LocalEventDescriptionProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1rem',
      }}
    >
      <Typography
        className="Venue"
        variant="h5"
        sx={{
          textDecoration: 'underline',
          padding: '.5rem',
          paddingBottom: 0,
        }}
      >
        Venue: {props.venue?.name || props.venue?.address || 'See Event'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          paddingY: '.5rem',
        }}
      >
        <Typography>{props.formattedDateRange}</Typography>
      </Box>
      <Box
        sx={{
          maxHeight: '15rem',
          overflowY: 'auto',
          border: '1px solid white',
          borderRadius: '5px',
          width: '100%',
        }}
        ref={props.scrollComponent}
      >
        <Typography
          sx={{
            padding: '.25rem',
            display: 'flex',
            overflowWrap: 'anywhere',
          }}
        >
          {props.description || 'No Description Provided'}
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          paddingTop: '1rem',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}
        ref={props.scrollXComponent}
      >
        {props.topics.edges.map((edge, idx) => (
          <Box key={idx} sx={{ display: 'flex', width: '100%' }}>
            <Chip
              label={edge.node.name}
              variant="filled"
              color="success"
              sx={{ flex: 1, marginX: '.15rem' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LocalEventDescription;
