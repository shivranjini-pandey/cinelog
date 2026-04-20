import ReviewCard from './ReviewCard'
import Spinner from '../ui/Spinner'
import Pagination from '../ui/Pagination'

export default function ReviewList({
  reviews, loading, page, totalPages,
  onPageChange, onDeleted,
}) {
  if (loading) return <Spinner />
  if (!reviews?.length) return (
    <p className="text-gray-500 text-sm text-center py-8">
      No reviews yet. Be the first!
    </p>
  )

  return (
    <div>
      <div className="space-y-4">
        {reviews.map(r => (
          <ReviewCard key={r.id} review={r} onDeleted={onDeleted} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}