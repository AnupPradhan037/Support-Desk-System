import axios from 'axios'

const getStats = async (token) => {
  const response = await axios.get('/api/stats', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const statsService = { getStats }

export default statsService