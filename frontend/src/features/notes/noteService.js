import axios from 'axios'

const API_URL = '/api/tickets/'

const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

// Get notes
const getNotes = async (ticketId, token) => {
  const response = await axios.get(
    `${API_URL}${ticketId}/notes`,
    authConfig(token)
  )
  return response.data
}

// Create note
const createNote = async (ticketId, noteData, token) => {
  const response = await axios.post(
    `${API_URL}${ticketId}/notes`,
    noteData,
    authConfig(token)
  )
  return response.data
}

const noteService = { getNotes, createNote }

export default noteService