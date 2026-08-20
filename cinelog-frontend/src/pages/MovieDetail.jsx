import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { getMovieDetail } from '../services/movieService'
import { getMovieReviews } from '../services/reviewService'
import { addToWatchlist, removeFromWatchlist, getMyWatchlist } from '../services/userService'
import { useAuth } from '../hooks/useAuth'
import ReviewForm from '../components/reviews/ReviewForm'
import ReviewList from '../components/reviews/ReviewList'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'

const PLACEHOLDER = 'https://via.placeholder.com/500x750/1f2937/6b7280?text=No+Poster'

export default function MovieDetail() {
  const { tmdb_id }               = useParams()
  const { user }                  = useAuth()

  const [movie,      setMovie]      = useState(null)
  const [movieErr,   setMovieErr]   = useState(null)
  const [reviews,    setReviews]    = useState([])
  const [revPage,    setRevPage]    = useState(1)
  const [revTotal,   setRevTotal]   = useState(1)
  const [revLoading, setRevLoading] = useState(false)
  const [inWatchlist,setInWatchlist]= useState(false)
  const [wlBusy,     setWlBusy]    = useState(false)

  useEffect(() => {
    getMovieDetail(tmdb_id)
      .then(res => setMovie(res.data))
      .catch(() => setMovieErr('Failed to load movie.'))
  }, [tmdb_id])

  useEffect(() => {
    if (!user) return
    getMyWatchlist()
      .then(res => {
        const ids = res.data.results.map(i => i.tmdb_movie_id)
        setInWatchlist(ids.includes(String(tmdb_id)))
      })
      .catch(() => {})
  }, [user, tmdb_id])

  const loadReviews = useCallback(async (p = 1) => {
    setRevLoading(true)
    try {
      const res = await getMovieReviews(tmdb_id, p)
      setReviews(res.data.results)
      setRevPage(res.data.page)
      setRevTotal(res.data.total_pages)
    } finally {
      setRevLoading(false)
    }
  }, [tmdb_id])

  useEffect(() => { loadReviews(1) }, [loadReviews])

  const handleWatchlist = async () => {
    if (!movie) return
    setWlBusy(true)
    try {
      if (inWatchlist) {
        await removeFromWatchlist(String(tmdb_id))
        setInWatchlist(false)
      } else {
        await addToWatchlist({
          tmdb_movie_id: String(tmdb_id),
          movie_title:   movie.title,
          poster_path:   movie.poster_url,
        })
        setInWatchlist(true)
      }
    } finally {
      setWlBusy(false)
    }
  }

  if (movieErr) return <ErrorMessage message={movieErr} />
  if (!movie)   return <Spinner />

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null

  const genres = Array.isArray(movie.genres) && movie.genres.length > 0
    && typeof movie.genres[0] === 'string'
    ? movie.genres.join(', ')
    : null

  return (
    <div className="min-h-screen bg-black pt-[90px]">

      {/* Backdrop */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={movie.backdrop_url || movie.poster_url || PLACEHOLDER}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30" />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 -mt-64 relative z-10">
        <div className="flex gap-8">

          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-[300px] rounded-xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.6)] border-2 border-purple-500/40">
              <img
                src={movie.poster_url || PLACEHOLDER}
                alt={movie.title}
                className="w-full h-[450px] object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-32">
            <h1 className="text-6xl text-white mb-4">{movie.title}</h1>

            <div className="flex items-center gap-6 mb-6">
              {movie.tmdb_rating > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-3xl text-yellow-400">{movie.tmdb_rating}</span>
                  <span className="text-gray-400">/10</span>
                </div>
              )}
              {movie.release_date && (
                <span className="text-xl text-gray-400">{movie.release_date.slice(0, 4)}</span>
              )}
              {runtime && (
                <span className="text-xl text-gray-400">{runtime}</span>
              )}
              {genres && (
                <span className="px-4 py-1.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 rounded-full border border-purple-500/30">
                  {genres}
                </span>
              )}
            </div>

            {/* Additional ratings row */}
            {(movie.imdb_rating && movie.imdb_rating !== 'N/A' || movie.rt_score) && (
              <div className="flex gap-6 mb-6 text-sm">
                {movie.imdb_rating && movie.imdb_rating !== 'N/A' && (
                  <div>
                    <p className="text-yellow-400 font-semibold">{movie.imdb_rating}</p>
                    <p className="text-gray-400">IMDb</p>
                  </div>
                )}
                {movie.rt_score && (
                  <div>
                    <p className="text-red-400 font-semibold">{movie.rt_score}</p>
                    <p className="text-gray-400">Rotten Tomatoes</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              {user && (
                <button
                  onClick={handleWatchlist}
                  disabled={wlBusy}
                  className={`px-8 py-3.5 rounded-full border-2 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    inWatchlist
                      ? 'border-pink-500 bg-pink-500/20 text-pink-400'
                      : 'border-purple-500/50 text-purple-400 hover:border-purple-500 hover:bg-purple-500/10'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWatchlist ? 'fill-pink-400' : ''}`} />
                  {wlBusy ? '...' : inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              )}
            </div>

            {/* Overview */}
            {movie.overview && (
              <div className="mb-8">
                <h3 className="text-2xl text-white mb-3">Overview</h3>
                <p className="text-lg text-gray-300 leading-relaxed max-w-xl">{movie.overview}</p>
              </div>
            )}

            {/* Cast */}
            {movie.cast?.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-gray-400 mb-2">Cast</h4>
                  <p className="text-xl text-white">{movie.cast.slice(0, 5).map(c => c.name).join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 mb-20">
          <div className="flex items-start gap-8">

            {/* Reviews List */}
            <div className="flex-1">
              <h2 className="text-4xl text-white mb-8">Reviews</h2>
              <ReviewList
                reviews={reviews}
                loading={revLoading}
                page={revPage}
                totalPages={revTotal}
                onPageChange={loadReviews}
                onDeleted={id => {
                  setReviews(prev => prev.filter(r => r.id !== id))
                }}
              />
            </div>

            {/* Leave a Review Box */}
            <div className="w-[400px] flex-shrink-0 sticky top-24">
              <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                <h3 className="text-2xl text-white mb-6">
                  {user ? 'Leave a Review' : 'Sign in to review'}
                </h3>
                {user
                  ? <ReviewForm movie={movie} onSubmitted={() => loadReviews(1)} />
                  : <p className="text-gray-500 text-sm">You need to be signed in to leave a review.</p>
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}