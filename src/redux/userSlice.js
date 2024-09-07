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
    setNotes: (state, action) => {
      state.notes = action.payload.notes;
    },
    setWishList: (state, action) => {
      state.user.wishList = action.payload;
    },
  },
});

export const { setLogin, setLogout, setNotes, setWishList } = userSlice.actions;
export default userSlice.reducer;
