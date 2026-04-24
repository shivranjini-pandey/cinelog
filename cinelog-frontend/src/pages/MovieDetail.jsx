import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
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

  if (movieErr)  return <ErrorMessage message={movieErr} />
  if (!movie)    return <Spinner />

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-10">

        <div className="shrink-0 w-full md:w-56">
          <img
            src={movie.poster_url || PLACEHOLDER}
            alt={movie.title}
            className="w-full rounded-xl border border-gray-700"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
            <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {runtime && <span>{runtime}</span>}
              {Array.isArray(movie.genres) && movie.genres.length > 0 &&
                typeof movie.genres[0] === 'string' && (
                <span>{movie.genres.join(', ')}</span>
              )}
            </div>
          </div>

          <div className="flex gap-6 mt-2 text-sm">
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
            {movie.tmdb_rating > 0 && (
              <div> 
                <p className="text-green-400 font-semibold">{movie.tmdb_rating}/10</p>
                <p className="text-gray-400">TMDB</p>
              </div>
            )}
          </div>

          {movie.overview && (
            <p className="text-gray-300 text-sm leading-relaxed max-w-xl mt-4">
              {movie.overview}
            </p>
          )}

          {movie.cast?.length > 0 && (
            <p className="text-gray-500 text-sm">
              <span className="text-gray-400">Cast: </span>
              {movie.cast.slice(0, 5).map(c => c.name).join(', ')}
            </p>
          )}

          {user && (
            <button
              onClick={handleWatchlist}
              disabled={wlBusy}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                inWatchlist
                  ? 'bg-gray-700 text-gray-300 hover:bg-red-900/40 hover:text-red-300'
                  : 'bg-green-500 text-black hover:bg-green-400'
              }`}
            >
              {wlBusy
                ? '...'
                : inWatchlist ? 'Remove from watchlist' : '+ Add to watchlist'
              }
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
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

        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            {user ? 'Your review' : 'Sign in to review'}
          </h2>
          {user
            ? <ReviewForm movie={movie} onSubmitted={() => loadReviews(1)} />
            : <p className="text-gray-500 text-sm">
                You need to be signed in to leave a review.
              </p>
          }
        </div>
      </div>
    </div>
  )
}