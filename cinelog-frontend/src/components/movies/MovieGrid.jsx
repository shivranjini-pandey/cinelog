import MovieCard from './MovieCard'
import Spinner from '../ui/Spinner'
import ErrorMessage from '../ui/ErrorMessage'

export default function MovieGrid({ movies, loading, error }) {
  if (loading) return <Spinner />
  if (error)   return <ErrorMessage message={error} />
  if (!movies?.length) return (
    <p className="text-gray-500 text-center py-16">No movies found.</p>
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map(movie => (
        <MovieCard key={movie.tmdb_id} movie={movie} />
      ))}
    </div>
  )
}