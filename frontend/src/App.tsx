'use client';
import { Provider } from 'react-redux';
import GlobalStore from './app/store';
import BoulderShines from './components/BoulderShines';
import { AppProps } from './pages';
import { Box } from '@mui/material';
import { useEffect } from 'react';

// const MeetupOAuthProvider = (props: { children: JSX.Element }) => {
//   useEffect(() => {
//     window.open('/api/oauth');
//   }, []);

//   return props.children;
// };

const App = (props: AppProps) => {
  GlobalStore.prototype.configureGlobalStore({
    app: {
      nodeEnv: props.nodeEnv,
      userLocation: props.userLocation,
      userView: !Boolean(props.userLocation),
      weatherView: Boolean(props.userLocation),
    },
  });

  return (
    <Provider store={GlobalStore.prototype.getStore()}>
      {/* <MeetupOAuthProvider> */}
      <BoulderShines />
      {/* </MeetupOAuthProvider> */}
    </Provider>
  );
};

export default App;
