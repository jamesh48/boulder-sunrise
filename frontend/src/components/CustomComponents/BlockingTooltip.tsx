import React from 'react';
import { Popper, Paper, Fade } from '@mui/material';

const BlockingTooltip = ({
  children,
  open,
  anchorRef,
}: {
  children: JSX.Element;
  open: boolean;
  anchorRef: React.MutableRefObject<null>;
}) => {
  return (
    open && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black color
          zIndex: 1500, // Ensure overlay appears above other components
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="right"
          transition
          style={{ zIndex: 1600 }} // Ensure tooltip content appears above overlay
          modifiers={[
            {
              name: 'preventOverflow',
              options: {
                boundary: 'scrollParent',
              },
            },
            {
              name: 'flip',
              enabled: true,
              options: {
                fallbackPlacements: ['top', 'bottom'],
              },
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper style={{ padding: '16px' }}>{children}</Paper>
            </Fade>
          )}
        </Popper>
      </div>
    )
  );
};

export default BlockingTooltip;
