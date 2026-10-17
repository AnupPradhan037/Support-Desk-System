import axios from 'axios'

const API_URL = '/api/tickets/'

const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

const createTicket = async (ticketData, token) => {
  const response = await axios.post(API_URL, ticketData, authConfig(token))
  return response.data
}

// params: { page, limit, status, priority, search, assigned } (empty values are dropped)
const getTickets = async (token, params = {}) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value)
  )
  const response = await axios.get(API_URL, {
    ...authConfig(token),
    params: cleaned,
  })
  return response.data // { tickets, page, pages, total }
}

const getTicket = async (ticketId, token) => {
  const response = await axios.get(`${API_URL}${ticketId}`, authConfig(token))
  return response.data
}

const updateTicket = async (ticketId, ticketData, token) => {
  const response = await axios.put(`${API_URL}${ticketId}`, ticketData, authConfig(token))
  return response.data
}

const closeTicket = async (ticketId, token) => {
  const response = await axios.put(`${API_URL}${ticketId}/close`, {}, authConfig(token))
  return response.data
}

const reopenTicket = async (ticketId, token) => {
  const response = await axios.put(`${API_URL}${ticketId}/reopen`, {}, authConfig(token))
  return response.data
}

const assignTicket = async (ticketId, token) => {
  const response = await axios.put(`${API_URL}${ticketId}/assign`, {}, authConfig(token))
  return response.data
}

const unassignTicket = async (ticketId, token) => {
  const response = await axios.put(`${API_URL}${ticketId}/unassign`, {}, authConfig(token))
  return response.data
}

const deleteTicket = async (ticketId, token) => {
  const response = await axios.delete(`${API_URL}${ticketId}`, authConfig(token))
  return response.data
}

const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  closeTicket,
  reopenTicket,
  assignTicket,
  unassignTicket,
  deleteTicket,
}

export default ticketService