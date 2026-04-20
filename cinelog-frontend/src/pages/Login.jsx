import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi, getMe } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function Login() {
  const { login }              = useAuth()
  const navigate               = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]  = useState(false)
  const [error, setError]      = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const response = await loginApi(username, password)
      const me = await getMe()
      login(me.data, response.access_token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2 text-center">Welcome back</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">Sign in to CineLog</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-600
                       rounded-lg px-4 py-3 text-sm border border-zinc-700
                       focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
                       transition-all"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-600
                       rounded-lg px-4 py-3 text-sm border border-zinc-700
                       focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
                       transition-all"
          />

          <ErrorMessage message={error} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50
                       text-black font-bold py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-zinc-600 text-sm text-center mt-6">
          No account?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Join CineLog
          </Link>
        </p>
      </div>
    </div>
  )
}