import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';
import { SwipeEventData, useSwipeable } from 'react-swipeable';

import {
  getUserView,
  getWeatherView,
  getDisabledTraySwipe,
  toggleUserView,
  toggleWeatherView,
} from '../../app/appSlice';

interface SwipeWheelProviderProps {
  children: JSX.Element;
}

const SwipeWheelProvider = (props: SwipeWheelProviderProps) => {
  const dispatch = useDispatch();

  const userView = useSelector(getUserView);
  const weatherView = useSelector(getWeatherView);
  const disabledTraySwipe = useSelector(getDisabledTraySwipe);

  const handleTrayViewOnWheelOrSwipe = (
    event: WheelEvent | SwipeEventData,
    direction: 'right' | 'left'
  ) => {
    if (!disabledTraySwipe) {
      if (
        direction === 'right' &&
        event &&
        Math.abs(event.deltaY) < Math.abs(event.deltaX)
      ) {
        if (userView) {
          dispatch(toggleUserView());
        } else if (!weatherView) {
          dispatch(toggleWeatherView());
        }
      }

      if (
        direction === 'left' &&
        event &&
        Math.abs(event.deltaY) < Math.abs(event.deltaX)
      ) {
        if (weatherView) {
          dispatch(toggleWeatherView());
        } else if (!userView) {
          dispatch(toggleUserView());
        }
      }
    }
  };

  const { ref } = useSwipeable({
    onSwipedRight: (eventData) =>
      handleTrayViewOnWheelOrSwipe(eventData, 'right'),
    onSwipedLeft: (eventData) =>
      handleTrayViewOnWheelOrSwipe(eventData, 'left'),
  }) as { ref: React.RefCallback<Document> };

  useEffect(() => {
    ref(document);
    // Clean up swipeable event listeners
    return () => ref({} as Document) as void;
  }, [ref]);

  return (
    <ReactScrollWheelHandler
      upHandler={(event) => handleTrayViewOnWheelOrSwipe(event, 'right')}
      downHandler={(event) => handleTrayViewOnWheelOrSwipe(event, 'left')}
    >
      {props.children}
    </ReactScrollWheelHandler>
  );
};

export default SwipeWheelProvider;
