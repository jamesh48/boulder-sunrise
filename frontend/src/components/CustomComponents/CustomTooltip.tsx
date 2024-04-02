import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';

interface CustomTooltipProps extends TooltipProps {
  ismoontime: boolean;
}

export const CustomTooltip = styled(
  ({ className, children, title, ...props }: CustomTooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} title={title}>
      {children}
    </Tooltip>
  )
)(({ theme, ismoontime }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: ismoontime ? theme.palette.primary.light : 'yellow',
    color: ismoontime ? 'white' : 'black',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));
