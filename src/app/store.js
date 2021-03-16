import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';
import instanceReducer from '../features/instance/instanceSlice';


export default configureStore({
  reducer: {
    navigation: navigationReducer,
    instance: instanceReducer
  },
});