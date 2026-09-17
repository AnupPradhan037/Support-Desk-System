import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'

import noteService from './noteService'

const initialState = {
  notes: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get Notes
export const getNotes = createAsyncThunk(
  'notes/getAll',
  async (ticketId, thunkAPI) => {
    try {
      const token =
        thunkAPI.getState().auth.user.token

      return await noteService.getNotes(
        ticketId,
        token
      )
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create Note
export const createNote = createAsyncThunk(
  'notes/create',
  async (
    { ticketId, text },
    thunkAPI
  ) => {
    try {
      const token =
        thunkAPI.getState().auth.user.token

      return await noteService.createNote(
        ticketId,
        { text },
        token
      )
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

const noteSlice = createSlice({
  name: 'note',

  initialState,

  reducers: {
    reset: (state) => {
      state.notes = []
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },

  extraReducers: (builder) => {
    builder

      // Get Notes
      .addCase(
        getNotes.pending,
        (state) => {
          state.isLoading = true
          state.isError = false
        }
      )

      .addCase(
        getNotes.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.notes = action.payload
        }
      )

      .addCase(
        getNotes.rejected,
        (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        }
      )

      // Create Note
      .addCase(
        createNote.pending,
        (state) => {
          state.isLoading = true
          state.isError = false
        }
      )

      .addCase(
        createNote.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.isSuccess = true

          state.notes.push(
            action.payload
          )
        }
      )

      .addCase(
        createNote.rejected,
        (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        }
      )
  },
})

export const { reset } =
  noteSlice.actions

export default noteSlice.reducer