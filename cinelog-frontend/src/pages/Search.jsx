import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMovies } from '../hooks/useMovies'
import MovieGrid from '../components/movies/MovieGrid'
import Pagination from '../components/ui/Pagination'

export default function Search() {
  const [searchParams]  = useSearchParams()
  const query = searchParams.get('q') || ''
  const { movies, loading, error, page, totalPages, fetchSearch } = useMovies()

  useEffect(() => {
    if (query) fetchSearch(query, 1)
  }, [query])

  const handlePageChange = p => {
    fetchSearch(query, p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-[140px] pb-8 space-y-6">

      <MovieGrid movies={movies} loading={loading} error={error} />

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}