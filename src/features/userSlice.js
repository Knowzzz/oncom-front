// src/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      address: null,
      username: "",
    },
    lastChannelId: null,
  },
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    setLastChannelId: (state, action) => {
      state.lastChannelId = action.payload;
    },
  },
});

export const { updateUser, setLastChannelId } = userSlice.actions;

export default userSlice.reducer;
