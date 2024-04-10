import { Box, Chip, Typography } from '@mui/material';
import useIsMobile from '@/app/customHooks/useIsMobile';
import { TopicEdge, Venue } from '../../shared/types';

interface LocalEventDescriptionProps {
  formattedDateRange: string;
  venue: Venue | undefined;
  topics: { edges: TopicEdge[] };
  description: string;
  scrollComponent: React.MutableRefObject<HTMLElement | undefined>;
  scrollXComponent: React.MutableRefObject<HTMLElement | undefined>;
}

const LocalEventDescription = (props: LocalEventDescriptionProps) => {
  const isMobile = useIsMobile();
  const topics = (() => {
    if (isMobile) {
      return props.topics.edges.slice(0, 3);
    }
    return props.topics.edges;
  })();

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
      {props.venue?.address ? (
        <Box>
          <Typography
            className="Venue"
            variant="h5"
            sx={{
              textDecoration: 'underline',
              padding: '.5rem',
              paddingBottom: 0,
            }}
          >
            Venue: {props.venue?.name}
          </Typography>
          <Box>
            <Typography
              className="address1"
              variant="h6"
              sx={{ marginBottom: 0 }}
            >
              {props.venue.address}
            </Typography>
            <Typography
              className="address2"
              variant="h6"
              sx={{ marginBottom: 0 }}
            >
              {props.venue.city}, {props.venue.state} {props.venue.postalCode}
            </Typography>
          </Box>
        </Box>
      ) : null}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          paddingBottom: '.5rem',
        }}
      >
        <Typography variant="h6">{props.formattedDateRange}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          maxHeight: '15rem',
          overflowY: 'auto',
          border: '1px solid white',
          borderRadius: '5px',
          width: isMobile ? '17.5rem' : '100%',
        }}
        ref={props.scrollComponent}
      >
        <Typography
          sx={{
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '.5rem',
            overflowWrap: 'anywhere',
          }}
        >
          {props.description || 'No Description Provided'}
        </Typography>
      </Box>

      <Box
        sx={{
          width: isMobile ? '75%' : '100%',
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
        {topics.map((edge, idx) => (
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
