import api from './api'

export const getProfile       = (username) =>
  api.get(`/users/${username}`)

export const updateProfile    = (data) =>
  api.patch('/users/me/profile', data)

export const getMyWatchlist   = () =>
  api.get('/users/me/watchlist')

export const addToWatchlist   = (data) =>
  api.post('/users/me/watchlist', data)

export const removeFromWatchlist = (tmdb_movie_id) =>
  api.delete(`/users/me/watchlist/${tmdb_movie_id}`)

export const getUserWatchlist = (username) =>
  api.get(`/users/${username}/watchlist`)