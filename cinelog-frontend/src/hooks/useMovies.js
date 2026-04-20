import { useState, useCallback } from 'react'
import { searchMovies, getByGenre, getTrending } from '../services/movieService'

export function useMovies() {
  const [movies,      setMovies]      = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)

  const fetchSearch = useCallback(async (query, p = 1) => {
    setLoading(true); setError(null)
    try {
      const res = await searchMovies(query, p)
      setMovies(res.data.results)
      setPage(res.data.page)
      setTotalPages(res.data.total_pages)
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchByGenre = useCallback(async (genreId, p = 1) => {
    setLoading(true); setError(null)
    try {
      const res = await getByGenre(genreId, p)
      setMovies(res.data.results)
      setPage(res.data.page)
      setTotalPages(res.data.total_pages)
    } catch {
      setError('Failed to load movies.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTrending = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await getTrending()
      setMovies(res.data.results)
      setTotalPages(1)
    } catch {
      setError('Failed to load trending movies.')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    movies, loading, error,
    page, totalPages,
    fetchSearch, fetchByGenre, fetchTrending,
  }
}