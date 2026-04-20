import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { deleteReview } from '../../services/reviewService'
import InsightBadges from './InsightBadges'
import StarRating from '../ui/StarRating'

export default function ReviewCard({ review, onDeleted }) {
  const { user }       = useAuth()
  const [busy, setBusy] = useState(false)
  const isOwner         = user?.username === review.author.username

  const handleDelete = async () => {
    if (!confirm('Delete this review?')) return
    setBusy(true)
    try {
      await deleteReview(review.id)
      onDeleted?.(review.id)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-green-400 font-medium text-sm">
            {review.author.username}
          </span>
          <span className="text-gray-600 text-xs ml-3">
            {new Date(review.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </span>
        </div>
        <StarRating value={review.rating} readonly />
      </div>

      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
        {review.content}
      </p>

      <InsightBadges insights={review.insights} />

      {isOwner && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleDelete}
            disabled={busy}
            className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
          >
            {busy ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}