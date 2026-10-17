import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import noteService from './noteService'
import { logout } from '../auth/authSlice'

const initialState = {
  notes: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || error.toString()

// Get notes
export const getNotes = createAsyncThunk(
  'notes/getAll',
  async (ticketId, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user
      if (!user?.token) {
        return thunkAPI.rejectWithValue('User is not logged in')
      }
      return await noteService.getNotes(ticketId, user.token)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

// Create note
export const createNote = createAsyncThunk(
  'notes/create',
  async ({ ticketId, text }, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user
      if (!user?.token) {
        return thunkAPI.rejectWithValue('User is not logged in')
      }
      return await noteService.createNote(ticketId, { text }, user.token)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

const noteSlice = createSlice({
  name: 'notes',
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
      // Get notes
      .addCase(getNotes.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.notes = action.payload
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Create note
      .addCase(createNote.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.notes.push(action.payload)
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Clear everything when the user logs out
      .addCase(logout.fulfilled, () => initialState)
  },
})

export const { reset } = noteSlice.actions
export default noteSlice.reducer