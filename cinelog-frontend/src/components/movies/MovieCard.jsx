import { useNavigate } from 'react-router-dom'

const PLACEHOLDER = 'https://via.placeholder.com/300x450/1f2937/6b7280?text=No+Poster'

export default function MovieCard({ movie }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/movie/${movie.tmdb_id}`)}
      className="cursor-pointer group relative rounded-2xl overflow-hidden
                 transition-all duration-300
                 hover:scale-[1.05]
                 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]"
    >
      {/* 🎬 Poster */}
      <div className="aspect-[2/3] relative overflow-hidden rounded-2xl">
        <img
          src={movie.poster_url || PLACEHOLDER}
          alt={movie.title}
          className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-90"
          loading="lazy"
        />

        {/* 🌑 Bottom fade overlay (for text readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* ✨ Purple border on hover */}
        <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-purple-500 transition-all duration-300" />

        {/* 🎯 Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">

          {/* Title */}
          <h3 className="text-white text-lg font-semibold leading-tight">
            {movie.title}
          </h3>

          {/* Ratings row */}
          <div className="flex items-center gap-3 text-sm">

            {movie.tmdb_rating > 0 && !movie.imdb_rating && (
              <span className="text-yellow-400 font-medium">
                ⭐ {movie.tmdb_rating}
              </span>
            )}

            {movie.release_date && (
              <span className="text-gray-300">
                {movie.release_date.slice(0, 4)}
              </span>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}