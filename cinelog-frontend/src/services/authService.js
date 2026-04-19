import api from './api'

export const register = (username, email, password) =>
  api.post('/auth/register', { username, email, password })

export const login = async (username, password) => {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  const res = await api.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  // Save token immediately so subsequent requests include it
  localStorage.setItem('token', res.data.access_token)
  return res.data
}

export const getMe = () => api.get('/auth/me')