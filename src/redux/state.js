import { createSlice } from "@reduxjs/toolkit";

const initalState = {
  user: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initalState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state, action) => {
      state.user = null;
      state.token = null;
    },
    setListings: (state, action) => {
      state.listings = action.payload.listings;
    },
  },
});

export const { setLogin, setLogout, setListings } = userSlice.actions;
export default userSlice.reducer;
