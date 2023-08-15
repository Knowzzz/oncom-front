import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  lastChannelId: {},
  actualFriendMessageId: null,
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
    setActualFriendMessageId: (state, action) => {
      state.actualFriendMessageId = action.payload;
    },
  },
});

export const { setUser, setLastChannelId, setLoading, setActualFriendMessageId } = userSlice.actions;
export default userSlice.reducer;
