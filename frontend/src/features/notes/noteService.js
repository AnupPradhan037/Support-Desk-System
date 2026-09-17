import axios from 'axios'

const API_URL = '/api/tickets/'

// Get Notes
const getNotes = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(
    `${API_URL}${ticketId}/notes`,
    config
  )

  return response.data
}

// Create Note
const createNote = async (
  ticketId,
  noteData,
  token
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(
    `${API_URL}${ticketId}/notes`,
    noteData,
    config
  )

  return response.data
}

const noteService = {
  getNotes,
  createNote,
}

export default noteService