import { useNavigate } from 'react-router-dom'

const PLACEHOLDER = 'https://via.placeholder.com/300x450/1f2937/6b7280?text=No+Poster'

export default function MovieCard({ movie }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/movie/${movie.tmdb_id}`)}
      className="cursor-pointer group rounded-lg overflow-hidden bg-gray-800
                 border border-gray-700 hover:border-green-500 transition-all
                 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/40"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster_url || PLACEHOLDER}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <h3 className="text-white text-sm font-medium truncate mb-2">
          {movie.title}
        </h3>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
          {movie.imdb_rating && movie.imdb_rating !== 'N/A' && (
            <span className="text-yellow-400">
              IMDb {movie.imdb_rating}
            </span>
          )}
          {movie.rt_score && (
            <span className="text-red-400">
              RT {movie.rt_score}
            </span>
          )}
          {movie.tmdb_rating > 0 && !movie.imdb_rating && (
            <span className="text-emerald-400">
              {movie.tmdb_rating}/10
            </span>
          )}
          {movie.release_date && (
            <span>{movie.release_date.slice(0, 4)}</span>
          )}
        </div>
      </div>
    </div>
  )
}