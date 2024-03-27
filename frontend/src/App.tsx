'use client';
import { Provider } from 'react-redux';
import GlobalStore from './app/store';
import WeatherReport from './components/WeatherReport';

const App = (props: {}) => {
  GlobalStore.prototype.configureGlobalStore({});

  return (
    <Provider store={GlobalStore.prototype.getStore()}>
      <WeatherReport />
    </Provider>
  );
};

export default App;
