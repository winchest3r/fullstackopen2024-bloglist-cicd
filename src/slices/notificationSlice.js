import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    changeNotification: (state, action) => {
      return action.payload;
    },
    clearNotification: () => {
      return null;
    },
  },
});

export const setNotification = (message, type = 'success') => {
  return (dispatch) => {
    dispatch(changeNotification({ type, message }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);
  };
};

export const { changeNotification, clearNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
