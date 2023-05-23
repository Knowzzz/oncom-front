import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  lastChannelId: {},
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLastChannelId: (state, action) => {
      state.lastChannelId[action.payload.daoId] = action.payload.channelId;
    },
    setLoading: (state, action) => { 
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, setLastChannelId, setLoading } = userSlice.actions;
export default userSlice.reducer;
