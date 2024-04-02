import { SvgIcon, SxProps } from '@mui/material';

interface HazeProps {
  sx?: SxProps;
}

const HazeIcon = (props: HazeProps) => {
  return (
    <SvgIcon sx={{ fontSize: 100, ...props.sx }}>
      <svg
        width="800px"
        height="800px"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        className="bi bi-cloud-haze"
      >
        <path d="M8.5 3a4.002 4.002 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 12H4.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 3zM0 7.5A.5.5 0 0 1 .5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm2 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-2 4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
      </svg>
    </SvgIcon>
  );
};

export default HazeIcon;
