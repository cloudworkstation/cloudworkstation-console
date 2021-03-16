import { createSlice } from '@reduxjs/toolkit';

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    value: "all",
  },
  reducers: {
    switchToAll: state => {
      state.value = "all";
    },
    switchToRunning: state => {
      state.value = "running";
    },
    switchToStopped: state => {
      state.value = "stopped";
    },
  },
});

export const { switchToAll, switchToRunning, switchToStopped } = navigationSlice.actions;

export const selectNav = state => state.navigation.value;

export default navigationSlice.reducer;