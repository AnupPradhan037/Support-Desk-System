import axios from 'axios'

const API_URL = '/api/tickets/'

// ==========================================
// CREATE TICKET
// ==========================================

const createTicket = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(
    API_URL,
    ticketData,
    config
  )

  return response.data
}

// ==========================================
// GET ALL TICKETS
// ==========================================

const getTickets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(
    API_URL,
    config
  )

  return response.data
}

// ==========================================
// GET SINGLE TICKET
// ==========================================

const getTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  console.log('Getting ticket:', ticketId)

  const response = await axios.get(
    `${API_URL}${ticketId}`,
    config
  )

  console.log('Single ticket response:', response.data)

  return response.data
}

// ==========================================
// UPDATE TICKET
// ==========================================

const updateTicket = async (
  ticketId,
  ticketData,
  token
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(
    `${API_URL}${ticketId}`,
    ticketData,
    config
  )

  return response.data
}

// ==========================================
// CLOSE TICKET
// ==========================================

const closeTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(
    `${API_URL}${ticketId}`,
    {
      status: 'closed',
    },
    config
  )

  return response.data
}

// ==========================================
// DELETE TICKET
// ==========================================

const deleteTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(
    `${API_URL}${ticketId}`,
    config
  )

  return response.data
}

const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  closeTicket,
  deleteTicket,
}

export default ticketService