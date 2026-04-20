import { useState } from 'react'
import { createReview } from '../../services/reviewService'
import StarRating from '../ui/StarRating'
import ErrorMessage from '../ui/ErrorMessage'

export default function ReviewForm({ movie, onSubmitted }) {
  const [rating,  setRating]  = useState(0)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    if (rating === 0)         return setError('Please select a rating.')
    if (content.length < 10)  return setError('Review must be at least 10 characters.')

    setLoading(true); setError(null)
    try {
      await createReview({
        tmdb_movie_id: String(movie.tmdb_id),
        movie_title:   movie.title,
        rating,
        content,
      })
      setRating(0)
      setContent('')
      onSubmitted?.()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit review.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-4">
      <h3 className="text-white font-medium">Write a review</h3>

      <div>
        <label className="text-gray-400 text-sm block mb-2">Your rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="text-gray-400 text-sm block mb-2">Your review</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="What did you think of this film?"
          className="w-full bg-gray-900 text-gray-100 placeholder-gray-600
                     rounded-lg px-4 py-3 text-sm border border-gray-700
                     focus:outline-none focus:border-green-500 resize-none
                     transition-colors"
        />
        <p className="text-gray-600 text-xs mt-1 text-right">
          {content.length}/5000
        </p>
      </div>

      <ErrorMessage message={error} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50
                   text-black font-medium py-2.5 rounded-lg transition-colors text-sm"
      >
        {loading ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  )
}