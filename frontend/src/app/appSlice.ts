import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export const appInitialState: {
  userLocation: string;
  nodeEnv: 'development' | 'test' | 'production';
  weatherView: boolean;
  userView: boolean;
  stateSwitch: boolean;
  disabledTraySwipe: boolean;
} = {
  userLocation: '',
  nodeEnv: 'production',
  weatherView: false,
  userView: false,
  stateSwitch: false,
  disabledTraySwipe: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<string>) => {
      state.userLocation = action.payload;
    },
    toggleWeatherView: (state) => {
      state.weatherView = !state.weatherView;
      if (state.userView) {
        state.userView = false;
      }
    },
    toggleUserView: (state) => {
      state.userView = !state.userView;
      if (state.weatherView) {
        state.weatherView = false;
      }
    },
    toggleStateSwitch: (state) => {
      state.stateSwitch = !state.stateSwitch;
    },
    accuateDisabledTraySwipe: (state, action: PayloadAction<boolean>) => {
      state.disabledTraySwipe = action.payload;
    },
  },
});

export const {
  setUserLocation,
  toggleWeatherView,
  toggleUserView,
  toggleStateSwitch,
  accuateDisabledTraySwipe,
} = appSlice.actions;

export const getStateSwitch = (state: RootState) => state.app.stateSwitch;
export const getUserLocation = (state: RootState) => state.app.userLocation;
export const getWeatherView = (state: RootState) => state.app.weatherView;
export const getUserView = (state: RootState) => state.app.userView;
export const getDisabledTraySwipe = (state: RootState) =>
  state.app.disabledTraySwipe;

export default appSlice.reducer;
