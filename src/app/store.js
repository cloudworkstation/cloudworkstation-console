import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';

export default configureStore({
  reducer: {
    navigation: navigationReducer
  },
});