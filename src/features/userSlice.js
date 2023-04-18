import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  lastChannelId: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLastChannelId: (state, action) => {
      // Utilisez l'ID de DAO comme clé et le channelId comme valeur
      state.lastChannelId[action.payload.daoId] = action.payload.channelId;
    },
  },
});

export const { setUser, setLastChannelId } = userSlice.actions;
export default userSlice.reducer;
