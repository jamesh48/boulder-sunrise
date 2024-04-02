import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export const appInitialState: {
  userLocation: string;
  nodeEnv: 'development' | 'test' | 'production';
  dataView: boolean;
  userView: boolean;
} = {
  userLocation: '',
  nodeEnv: 'production',
  dataView: false,
  userView: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<string>) => {
      state.userLocation = action.payload;
    },
    toggleDataView: (state) => {
      state.dataView = !state.dataView;
      if (state.userView) {
        state.userView = false;
      }
    },
    toggleUserView: (state) => {
      state.userView = !state.userView;
      if (state.dataView) {
        state.dataView = false;
      }
    },
  },
});

export const { setUserLocation, toggleDataView, toggleUserView } =
  appSlice.actions;

export const getUserLocation = (state: RootState) => state.app.userLocation;
export const getDataView = (state: RootState) => state.app.dataView;
export const getUserView = (state: RootState) => state.app.userView;

export default appSlice.reducer;
