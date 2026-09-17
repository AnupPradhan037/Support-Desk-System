import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ticketService from './ticketService'

const initialState = {
  tickets: [],
  ticket: null,

  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
}

// ==========================================
// CREATE TICKET
// ==========================================

export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user

      if (!user || !user.token) {
        return thunkAPI.rejectWithValue(
          'User is not logged in'
        )
      }

      return await ticketService.createTicket(
        ticketData,
        user.token
      )
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create ticket'

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// ==========================================
// GET ALL TICKETS
// ==========================================

export const getTickets = createAsyncThunk(
  'tickets/getAll',
  async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user

      if (!user || !user.token) {
        return thunkAPI.rejectWithValue(
          'User is not logged in'
        )
      }

      return await ticketService.getTickets(
        user.token
      )
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to get tickets'

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// ==========================================
// GET SINGLE TICKET
// ==========================================

export const getTicket = createAsyncThunk(
  'tickets/getOne',
  async (ticketId, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user

      if (!user || !user.token) {
        return thunkAPI.rejectWithValue(
          'User is not logged in'
        )
      }

      return await ticketService.getTicket(
        ticketId,
        user.token
      )
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to get ticket'

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// ==========================================
// UPDATE TICKET
// ==========================================

export const updateTicket = createAsyncThunk(
  'tickets/update',
  async ({ ticketId, ticketData }, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user

      if (!user || !user.token) {
        return thunkAPI.rejectWithValue(
          'User is not logged in'
        )
      }

      return await ticketService.updateTicket(
        ticketId,
        ticketData,
        user.token
      )
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update ticket'

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// ==========================================
// CLOSE TICKET
// ==========================================

export const closeTicket = createAsyncThunk(
  'tickets/close',
  async (ticketId, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user

      if (!user || !user.token) {
        return thunkAPI.rejectWithValue(
          'User is not logged in'
        )
      }

      return await ticketService.closeTicket(
        ticketId,
        user.token
      )
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to close ticket'

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// ==========================================
// DELETE TICKET
// ==========================================

export const deleteTicket = createAsyncThunk(
  'tickets/delete',
  async (ticketId, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user

      if (!user || !user.token) {
        return thunkAPI.rejectWithValue(
          'User is not logged in'
        )
      }

      return await ticketService.deleteTicket(
        ticketId,
        user.token
      )
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete ticket'

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// ==========================================
// TICKET SLICE
// ==========================================

const ticketSlice = createSlice({
  name: 'tickets',

  initialState,

  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },

    resetTicket: (state) => {
      state.ticket = null
    },
  },

  extraReducers: (builder) => {
    builder

      // ====================================
      // CREATE TICKET
      // ====================================

      .addCase(
        createTicket.pending,
        (state) => {
          state.isLoading = true
          state.isError = false
          state.isSuccess = false
        }
      )

      .addCase(
        createTicket.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.isSuccess = true

          state.tickets.push(
            action.payload
          )

          state.message = ''
        }
      )

      .addCase(
        createTicket.rejected,
        (state, action) => {
          state.isLoading = false
          state.isError = true
          state.isSuccess = false

          state.message =
            action.payload ||
            'Failed to create ticket'
        }
      )

      // ====================================
      // GET ALL TICKETS
      // ====================================

      .addCase(
        getTickets.pending,
        (state) => {
          state.isLoading = true
          state.isError = false
          state.isSuccess = false
        }
      )

      .addCase(
        getTickets.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.isSuccess = true

          // IMPORTANT:
          // getTickets returns an ARRAY
          state.tickets =
            Array.isArray(action.payload)
              ? action.payload
              : []

          state.message = ''
        }
      )

      .addCase(
        getTickets.rejected,
        (state, action) => {
          state.isLoading = false
          state.isError = true
          state.isSuccess = false

          state.message =
            action.payload ||
            'Failed to get tickets'
        }
      )

      // ====================================
      // GET SINGLE TICKET
      // ====================================

      .addCase(
        getTicket.pending,
        (state) => {
          state.isLoading = true
          state.isError = false
          state.isSuccess = false

          state.ticket = null
        }
      )

      .addCase(
        getTicket.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.isSuccess = true

          // =================================
          // THIS IS THE IMPORTANT FIX
          // =================================
          // getTicket returns ONE object.
          // Therefore use state.ticket.
          state.ticket = action.payload

          state.message = ''
        }
      )

      .addCase(
        getTicket.rejected,
        (state, action) => {
          state.isLoading = false
          state.isError = true
          state.isSuccess = false

          state.ticket = null

          state.message =
            action.payload ||
            'Failed to get ticket'
        }
      )

      // ====================================
      // UPDATE TICKET
      // ====================================

      .addCase(
        updateTicket.pending,
        (state) => {
          state.isLoading = true
          state.isError = false
        }
      )

      .addCase(
        updateTicket.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.isSuccess = true

          state.ticket =
            action.payload

          state.tickets =
            state.tickets.map(
              (ticket) =>
                ticket._id ===
                action.payload._id
                  ? action.payload
                  : ticket
            )

          state.message = ''
        }
      )

      .addCase(
        updateTicket.rejected,
        (state, action) => {
          state.isLoading = false
          state.isError = true

          state.message =
            action.payload ||
            'Failed to update ticket'
        }
      )

      // ====================================
      // CLOSE TICKET
      // ====================================

      .addCase(
        closeTicket.pending,
        (state) => {
          state.isLoading = true
          state.isError = false
        }
      )

      .addCase(
        closeTicket.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.isSuccess = true

          // Update current ticket
          state.ticket =
            action.payload

          // Update ticket in list
          state.tickets =
            state.tickets.map(
              (ticket) =>
                ticket._id ===
                action.payload._id
                  ? action.payload
                  : ticket
            )

          state.message = ''
        }
      )

      .addCase(
        closeTicket.rejected,
        (state, action) => {
          state.isLoading = false
          state.isError = true

          state.message =
            action.payload ||
            'Failed to close ticket'
        }
      )

      // ====================================
      // DELETE TICKET
      // ====================================

      .addCase(
        deleteTicket.pending,
        (state) => {
          state.isLoading = true
          state.isError = false
        }
      )

      .addCase(
        deleteTicket.fulfilled,
        (state, action) => {
          state.isLoading = false
          state.isSuccess = true

          state.tickets =
            state.tickets.filter(
              (ticket) =>
                ticket._id !==
                action.payload.id
            )

          state.message = ''
        }
      )

      .addCase(
        deleteTicket.rejected,
        (state, action) => {
          state.isLoading = false
          state.isError = true

          state.message =
            action.payload ||
            'Failed to delete ticket'
        }
      )
  },
})

export const {
  reset,
  resetTicket,
} = ticketSlice.actions

export default ticketSlice.reducer