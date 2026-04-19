import api from './api'

export const searchMovies   = (q, page = 1) =>
  api.get('/movies/search', { params: { q, page } })

export const getGenres      = () =>
  api.get('/movies/genres')

export const getByGenre     = (genre_id, page = 1) =>
  api.get('/movies/by-genre', { params: { genre_id, page } })

export const getTrending    = (time_window = 'week') =>
  api.get('/movies/trending', { params: { time_window } })

export const getMovieDetail = (tmdb_id) =>
  api.get(`/movies/${tmdb_id}`)