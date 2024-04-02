'use client';
import { Provider } from 'react-redux';
import GlobalStore from './app/store';
import BoulderShines from './components/BoulderShines';

const App = (props: {
  userLocation: string;
  nodeEnv: 'development' | 'test' | 'production';
}) => {
  GlobalStore.prototype.configureGlobalStore({
    app: {
      nodeEnv: props.nodeEnv,
      userLocation: props.userLocation,
      userView: !Boolean(props.userLocation),
    },
  });

  return (
    <Provider store={GlobalStore.prototype.getStore()}>
      <BoulderShines />
    </Provider>
  );
};

export default App;
