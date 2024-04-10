import { accuateDisabledTraySwipe } from '@/app/appSlice';
import useIsMobile from '@/app/customHooks/useIsMobile';
import { Box, Typography, useTheme } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { LocalEvent as LocalEventProps } from '../../shared/types';
import LocalEventDescription from './LocalEventDescription';
import MemoizedTooltip from '../CustomComponents/HTMLTooltip';

interface LocalEventPropsWithRef extends LocalEventProps {
  outerScrollComponent: React.MutableRefObject<HTMLDivElement | undefined>;
  openIndex: number;
  handleOpenIndex: (idx: number) => void;
  eventOpen: boolean;
  timezone: string | undefined;
  searchAdditionalOptionsOpen: boolean;
}

const LocalEvent = (props: LocalEventPropsWithRef) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const scrollComponent = useRef<HTMLElement>();
  const scrollXComponent = useRef<HTMLElement>();
  const activeEventRef = useRef<HTMLDivElement>();

  const isMobile = useIsMobile();

  const handleToolTipScroll = useCallback((e: WheelEvent) => {
    scrollComponent.current?.scrollTo({
      top: scrollComponent.current?.scrollTop + e.deltaY,
      behavior: 'auto',
    });

    scrollXComponent.current?.scrollTo({
      left: scrollXComponent.current?.scrollLeft + e.deltaX,
      behavior: 'auto',
    });
  }, []);

  useEffect(() => {
    dispatch(accuateDisabledTraySwipe(props.eventOpen));
  }, [props.eventOpen, dispatch]);

  const cachedMouseWheelHandler = useMemo(
    () => props.outerScrollComponent.current?.onwheel,
    [props.outerScrollComponent]
  );

  useEffect(() => {
    if (props.outerScrollComponent?.current) {
      if (props.eventOpen) {
        props.outerScrollComponent.current.onwheel = (e) => {
          e.preventDefault();
        };
        window.addEventListener('wheel', handleToolTipScroll, true);
      }
      return () => {
        window.removeEventListener('wheel', handleToolTipScroll, true);
        if (props.outerScrollComponent.current) {
          props.outerScrollComponent.current.onwheel = cachedMouseWheelHandler!;
        }
      };
    }
  }, [
    props.eventOpen,
    handleToolTipScroll,
    props.outerScrollComponent,
    cachedMouseWheelHandler,
  ]);

  const startDateTime = new Date(new Date(props.dateTime));

  const endDateTime = new Date(props.endTime);

  const formattedDateRange = `${startDateTime.toLocaleDateString(
    'en-US'
  )} ${startDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: props.timezone,
  })} - ${endDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: props.timezone,
  })}`;

  const handleOpenTooltip = useCallback(() => {
    if (!isMobile && !props.searchAdditionalOptionsOpen) {
      props.handleOpenIndex(props.openIndex);
    }
  }, [isMobile, props]);

  const handleLeaveTooltip = useCallback(() => {
    if (!isMobile) {
      props.handleOpenIndex(-1);
    }
  }, [isMobile, props]);

  return (
    <MemoizedTooltip
      placement="right"
      open={!isMobile && props.eventOpen}
      description={
        <LocalEventDescription
          formattedDateRange={formattedDateRange}
          venue={props.venue}
          topics={props.topics}
          description={props.description}
          scrollComponent={scrollComponent}
          scrollXComponent={scrollXComponent}
        />
      }
      divOrSpan="div"
      opacity={1}
      backgroundColor={theme.palette.primary.main}
      textColor="white"
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          cursor: 'pointer',
          borderRadius: '1rem',
          border: '1px solid ' + theme.palette.primary.main,
          marginBottom: '1rem',
          marginX: '.5rem',
        }}
        ref={activeEventRef}
        onClick={() => {
          if (isMobile) {
            props.handleOpenIndex(props.openIndex);
            // Reset Scroll Position of Active Element after another one Closes
            setTimeout(() => {
              if (activeEventRef.current) {
                activeEventRef.current.scrollIntoView({
                  behavior: 'instant',
                  block: 'start',
                });
              }
            }, 0);
          } else {
            window.open(props.eventUrl);
          }
        }}
        onMouseOver={handleOpenTooltip}
        onMouseLeave={handleLeaveTooltip}
      >
        <Typography
          variant="h5"
          sx={{ marginTop: '.5rem', textAlign: 'center' }}
        >
          {props.title}
        </Typography>
        <Box sx={{ padding: '.5rem' }}>
          <Image
            src={props.imageUrl}
            width={100}
            height={100}
            alt={props.title}
            layout="responsive"
          />
        </Box>
        {isMobile && props.eventOpen ? (
          <LocalEventDescription
            formattedDateRange={formattedDateRange}
            venue={props.venue}
            topics={props.topics}
            description={props.description}
            scrollComponent={scrollComponent}
            scrollXComponent={scrollXComponent}
          />
        ) : null}
      </Box>
    </MemoizedTooltip>
  );
};

export default LocalEvent;
