import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './slices/notificationSlice';
import blogsReducer from './slices/blogsSlice';
import loggedUserReducer from './slices/loggedUserSlice';

export default configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    loggedUser: loggedUserReducer,
  },
});
