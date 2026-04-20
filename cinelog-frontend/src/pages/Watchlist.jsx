import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyWatchlist, removeFromWatchlist } from '../services/userService'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'

const PLACEHOLDER = 'https://via.placeholder.com/300x450/1f2937/6b7280?text=No+Poster'

export default function Watchlist() {
  const navigate              = useNavigate()
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    getMyWatchlist()
      .then(res => setItems(res.data.results))
      .catch(() => setError('Failed to load watchlist.'))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async id => {
    await removeFromWatchlist(id)
    setItems(prev => prev.filter(i => i.tmdb_movie_id !== id))
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Your watchlist
        <span className="text-gray-500 font-normal text-base ml-3">{items.length} films</span>
      </h1>

      <ErrorMessage message={error} />

      {items.length === 0 && !error && (
        <p className="text-gray-500 text-center py-16">
          Your watchlist is empty. Browse movies and add some!
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map(item => (
          <div key={item.id} className="group relative">
            <div
              onClick={() => navigate(`/movie/${item.tmdb_movie_id}`)}
              className="cursor-pointer rounded-lg overflow-hidden border border-gray-700
                         hover:border-green-500 transition-all hover:scale-[1.03]"
            >
              <img
                src={item.poster_path || PLACEHOLDER}
                alt={item.movie_title}
                className="w-full aspect-[2/3] object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-gray-400 text-xs mt-1.5 truncate">{item.movie_title}</p>
            <button
              onClick={() => handleRemove(item.tmdb_movie_id)}
              className="absolute top-1.5 right-1.5 bg-black/70 text-gray-400
                         hover:text-red-400 rounded-full w-6 h-6 text-xs
                         opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}