'use client';
import { Provider } from 'react-redux';
import GlobalStore from './app/store';
import BoulderShines from './components/BoulderShines';

const App = (props: {}) => {
  GlobalStore.prototype.configureGlobalStore({});

  return (
    <Provider store={GlobalStore.prototype.getStore()}>
      <BoulderShines />
    </Provider>
  );
};

export default App;
