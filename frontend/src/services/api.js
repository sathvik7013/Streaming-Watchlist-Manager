import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data)
}

export const contentAPI = {
  getAll: () => api.get('/content'),
  getById: (id) => api.get(`/content/${id}`),
  search: (keyword) => api.get(`/content/search?keyword=${keyword}`),
  getByType: (type) => api.get(`/content/type/${type}`),
  getByGenre: (genre) => api.get(`/content/genre/${genre}`),
  getByPlatform: (platform) => api.get(`/content/platform/${platform}`)
}

export const watchlistAPI = {
  getAll: () => api.get('/watchlist'),
  getByStatus: (status) => api.get(`/watchlist/filter?status=${status}`),
  getStats: () => api.get('/watchlist/stats'),
  add: (data) => api.post('/watchlist', data),
  update: (id, data) => api.put(`/watchlist/${id}`, data),
  remove: (id) => api.delete(`/watchlist/${id}`)
}

export default api
