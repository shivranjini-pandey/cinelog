import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = e => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <nav className="bg-black border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">

        <Link to="/" className="text-emerald-400 font-bold text-2xl tracking-tight shrink-0 hover:text-emerald-300 transition-colors">
          CineLog
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500
                       rounded-lg px-4 py-2.5 text-sm border border-zinc-700
                       focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
                       transition-all"
          />
        </form>

        <div className="flex items-center gap-4 ml-auto shrink-0">
          {user ? (
            <>
              <Link
                to={`/profile/${user.username}`}
                className="text-zinc-400 hover:text-emerald-400 text-sm font-medium transition-colors"
              >
                {user.username}
              </Link>
              <Link
                to="/watchlist"
                className="text-zinc-400 hover:text-emerald-400 text-sm font-medium transition-colors"
              >
                Watchlist
              </Link>
              <button
                onClick={logout}
                className="text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold
                           text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}