import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile } from '../services/userService'
import { getUserReviews } from '../services/reviewService'
import ReviewList from '../components/reviews/ReviewList'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function Profile() {
  const { username }              = useParams()
  const [profile,  setProfile]   = useState(null)
  const [reviews,  setReviews]   = useState([])
  const [page,     setPage]      = useState(1)
  const [total,    setTotal]     = useState(1)
  const [loading,  setLoading]   = useState(true)
  const [error,    setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getProfile(username),
      getUserReviews(username, 1),
    ])
      .then(([profRes, revRes]) => {
        setProfile(profRes.data)
        setReviews(revRes.data.results)
        setTotal(revRes.data.total_pages)
        setPage(1)
      })
      .catch(() => setError('User not found.'))
      .finally(() => setLoading(false))
  }, [username])

  const handlePageChange = async p => {
    const res = await getUserReviews(username, p)
    setReviews(res.data.results)
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <Spinner />
  if (error)   return <div className="max-w-2xl mx-auto px-4 py-16"><ErrorMessage message={error} /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-900 border border-green-700
                          flex items-center justify-center text-green-400 font-bold text-xl">
            {profile.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
            <p className="text-gray-500 text-sm">
              {profile.review_count} review{profile.review_count !== 1 ? 's' : ''} •{' '}
              joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        {profile.bio && (
          <p className="mt-4 text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
        <ReviewList
          reviews={reviews}
          loading={false}
          page={page}
          totalPages={total}
          onPageChange={handlePageChange}
          onDeleted={id => setReviews(prev => prev.filter(r => r.id !== id))}
        />
      </div>
    </div>
  )
}