import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Popper, Tooltip, TooltipProps } from '@mui/material';
import { getStateSwitch } from '@/app/appSlice';

interface HtmlTooltipProps {
  children: TooltipProps['children'];
  description: TooltipProps['title'];
  divOrSpan: 'div' | 'span';
  open?: TooltipProps['open'];
  placement: TooltipProps['placement'];
  parentRef?: React.MutableRefObject<HTMLDivElement>;
  backgroundColor?: string;
  borderColor?: string;
  opacity?: number;
  onMouseEnter?: TooltipProps['onMouseEnter'];
  onMouseLeave?: TooltipProps['onMouseEnter'];
  padding?: string | number;
  textColor?: string;
}

const HtmlTooltip = ({
  children,
  description,
  divOrSpan,
  open = undefined,
  placement,
  parentRef,
  backgroundColor,
  textColor = 'black',
  opacity = 0.9,
  borderColor = 'white',
  padding = '.25rem .5rem',
}: HtmlTooltipProps): JSX.Element => {
  // state switch to rerender the tooltip when trays open/close
  useSelector(getStateSwitch);

  // eslint-disable-next-line react/display-name
  const TooltipParent = React.forwardRef((props, ref) => {
    return divOrSpan === 'div' ? (
      <div {...props} ref={ref as React.LegacyRef<HTMLDivElement> | undefined}>
        {children}
      </div>
    ) : (
      <span
        {...props}
        ref={ref as React.LegacyRef<HTMLSpanElement> | undefined}
      >
        {children}
      </span>
    );
  });

  return (
    <Tooltip
      disableFocusListener
      disableTouchListener
      arrow
      placement={placement}
      open={open ?? undefined}
      PopperComponent={(theseProps) => {
        return (
          <Popper
            {...theseProps}
            anchorEl={parentRef?.current || theseProps.anchorEl}
          >
            {theseProps.children}
          </Popper>
        );
      }}
      componentsProps={{
        tooltip: {
          sx: {
            color: textColor,
            maxWidth: '45rem',
            bgcolor: backgroundColor || 'rhapsodyBlue.main',
            border: `1px solid ${borderColor}`,
            opacity: `${opacity} !important`,
            padding,
            boxShadow: '.3rem .3rem 1rem rgba(0,0,0,0.12)',
          },
        },
        arrow: {
          sx: {
            '&:before': {
              bgcolor: backgroundColor || 'rhapsodyBlue.main',
              border: `1px solid ${borderColor}`,
              opacity: `${opacity} !important`,
              boxShadow: '.3rem .3rem 1rem rgba(0,0,0,0.12)',
            },
          },
        },
      }}
      title={<Box>{description}</Box>}
    >
      <TooltipParent />
    </Tooltip>
  );
};
const MemoizedTooltip = React.memo(HtmlTooltip, (prevProps, nextProps) => {
  return (
    prevProps.description === nextProps.description &&
    prevProps.open === nextProps.open
  );
});

export default MemoizedTooltip;
