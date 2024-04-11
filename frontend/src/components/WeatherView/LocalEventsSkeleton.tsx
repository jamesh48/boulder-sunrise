import { Box, Skeleton } from '@mui/material';

const LocalEventsSkeleton = () => {
  return (
    <Box>
      <Box sx={{ mt: '1rem' }}>
        <Skeleton variant="rectangular" width={300} height={250} />
      </Box>
      <Box sx={{ mt: '1rem' }}>
        <Skeleton variant="rectangular" width={300} height={250} />
      </Box>
      <Box sx={{ mt: '1rem' }}>
        <Skeleton variant="rectangular" width={300} height={250} />
      </Box>
    </Box>
  );
};

export default LocalEventsSkeleton;
