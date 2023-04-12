// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
