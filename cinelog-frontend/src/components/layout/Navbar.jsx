import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Search, Film, Home as HomeIcon, Heart, User, LogIn } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-2xl border-b border-gray-800 shadow-md">

      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-10 py-6 flex items-center justify-between">

        {/* LOGO */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3"
        >
          <Film className="w-8 h-8 text-purple-500" />
          <span className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            CineLog
          </span>
        </button>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="flex-1 flex justify-center px-10">
          <div
            className={`relative w-full max-w-lg transition-all ${
              focused ? "shadow-[0_0_12px_rgba(168,85,247,0.2)]" : ""
            }`}
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-gray-900/95 border border-gray-700 rounded-full py-6 pl-16 pr-8 text-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
        </form>

        {/* NAV LINKS */}
        <div className="flex items-center gap-8 text-base">

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition"
          >
            <HomeIcon className="w-5 h-5" />
            Home
          </button>

          <button
            onClick={() => navigate('/watchlist')}
            className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition"
          >
            <Heart className="w-5 h-5" />
            Watchlist
          </button>

          {user ? (
            <>
              <button
                onClick={() => navigate(`/profile/${user.username}`)}
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition"
              >
                <User className="w-5 h-5" />
                {user.username}
              </button>

              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-400 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] transition"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>

      </div>
    </nav>
  )
}