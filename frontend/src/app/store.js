import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'

import authReducer, { logout } from '../features/auth/authSlice'
import ticketReducer from '../features/tickets/ticketSlice'
import noteReducer from '../features/notes/noteSlice'


axios.defaults.baseURL = process.env.REACT_APP_API_URL || ''

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    notes: noteReducer,
  },
})

// If the backend rejects the token, log out so the user is sent to /login
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || ''

    if (
      error.response?.status === 401 &&
      message.startsWith('Not authorized')
    ) {
      store.dispatch(logout())
    }

    return Promise.reject(error)
  }
)