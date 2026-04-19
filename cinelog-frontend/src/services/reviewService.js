import api from './api'

export const createReview  = (data) =>
  api.post('/reviews', data)

export const getMovieReviews = (tmdb_movie_id, page = 1) =>
  api.get(`/reviews/movie/${tmdb_movie_id}`, { params: { page } })

export const getUserReviews  = (username, page = 1) =>
  api.get(`/reviews/user/${username}`, { params: { page } })

export const updateReview  = (review_id, data) =>
  api.patch(`/reviews/${review_id}`, data)

export const deleteReview  = (review_id) =>
  api.delete(`/reviews/${review_id}`)