import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ticketService from './ticketService'
import { logout } from '../auth/authSlice'

const initialState = {
  tickets: [],
  pagination: { page: 1, pages: 1, total: 0 },
  ticket: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
}

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback

const makeThunk = (type, fallback, call) =>
  createAsyncThunk(type, async (arg, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user
      if (!user?.token) {
        return thunkAPI.rejectWithValue('User is not logged in')
      }
      return await call(arg, user.token)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, fallback))
    }
  })

export const createTicket = makeThunk(
  'tickets/create',
  'Failed to create ticket',
  (ticketData, token) => ticketService.createTicket(ticketData, token)
)

// arg: { page, status, priority, search, assigned }
export const getTickets = makeThunk(
  'tickets/getAll',
  'Failed to get tickets',
  (params, token) => ticketService.getTickets(token, params)
)

export const getTicket = makeThunk(
  'tickets/getOne',
  'Failed to get ticket',
  (ticketId, token) => ticketService.getTicket(ticketId, token)
)

export const updateTicket = makeThunk(
  'tickets/update',
  'Failed to update ticket',
  ({ ticketId, ticketData }, token) =>
    ticketService.updateTicket(ticketId, ticketData, token)
)

export const closeTicket = makeThunk(
  'tickets/close',
  'Failed to close ticket',
  (ticketId, token) => ticketService.closeTicket(ticketId, token)
)

export const reopenTicket = makeThunk(
  'tickets/reopen',
  'Failed to reopen ticket',
  (ticketId, token) => ticketService.reopenTicket(ticketId, token)
)

export const assignTicket = makeThunk(
  'tickets/assign',
  'Failed to assign ticket',
  (ticketId, token) => ticketService.assignTicket(ticketId, token)
)

export const unassignTicket = makeThunk(
  'tickets/unassign',
  'Failed to unassign ticket',
  (ticketId, token) => ticketService.unassignTicket(ticketId, token)
)

export const deleteTicket = makeThunk(
  'tickets/delete',
  'Failed to delete ticket',
  (ticketId, token) => ticketService.deleteTicket(ticketId, token)
)

const replaceInList = (tickets, updated) =>
  tickets.map((t) => (t._id === updated._id ? updated : t))

// Shared handling for thunks that return one updated ticket.
// They don't touch isLoading, so the Ticket page doesn't flash a spinner.
const addTicketUpdateCases = (builder, thunk, fallback) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.isError = false
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.isSuccess = true
      state.ticket = action.payload
      state.tickets = replaceInList(state.tickets, action.payload)
      state.message = ''
    })
    .addCase(thunk.rejected, (state, action) => {
      state.isError = true
      state.message = action.payload || fallback
    })
}

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
    // CREATE
    builder
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = ''
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.payload || 'Failed to create ticket'
      })

      // GET ALL (paginated)
      .addCase(getTickets.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        const { tickets, page, pages, total } = action.payload
        state.isLoading = false
        state.isSuccess = true
        state.tickets = Array.isArray(tickets) ? tickets : []
        state.pagination = { page, pages, total }
        state.message = ''
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.payload || 'Failed to get tickets'
      })

      // GET ONE
      .addCase(getTicket.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.isSuccess = false
        state.ticket = null
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ticket = action.payload
        state.message = ''
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.ticket = null
        state.message = action.payload || 'Failed to get ticket'
      })

      // DELETE
      .addCase(deleteTicket.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tickets = state.tickets.filter((t) => t._id !== action.payload.id)
        state.message = ''
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload || 'Failed to delete ticket'
      })

    // UPDATE / CLOSE / REOPEN / ASSIGN / UNASSIGN
    addTicketUpdateCases(builder, updateTicket, 'Failed to update ticket')
    addTicketUpdateCases(builder, closeTicket, 'Failed to close ticket')
    addTicketUpdateCases(builder, reopenTicket, 'Failed to reopen ticket')
    addTicketUpdateCases(builder, assignTicket, 'Failed to assign ticket')
    addTicketUpdateCases(builder, unassignTicket, 'Failed to unassign ticket')

    // Clear everything when the user logs out
    builder.addCase(logout.fulfilled, () => initialState)
  },
})

export const { reset, resetTicket } = ticketSlice.actions
export default ticketSlice.reducer