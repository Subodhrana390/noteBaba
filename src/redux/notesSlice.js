import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  notes: [],
  totalNotes: 0,
  status: "idle",
  error: null,
};

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (queryString) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/notes?${queryString}`
    );
    return response.data;
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearNotes(state) {
      state.notes = [];
      state.totalNotes = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notes = action.payload.notes;
        state.totalNotes = action.payload.total || 0;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearNotes } = notesSlice.actions;
export default notesSlice.reducer;
