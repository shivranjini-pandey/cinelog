import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '../services/authService'
import { login as loginApi, getMe } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function Register() {
  const { login }              = useAuth()
  const navigate               = useNavigate()
  const [username, setUsername] = useState('')
  const [email,    setEmail]   = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await registerApi(username, email, password)
      const response = await loginApi(username, password)
      const me = await getMe()
      login(me.data, response.access_token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2 text-center">Create account</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">Join CineLog</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            minLength={3} maxLength={30}
            required
            className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-600
                       rounded-lg px-4 py-3 text-sm border border-zinc-700
                       focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
                       transition-all"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
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
            placeholder="Password (min 8 characters)"
            minLength={8}
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-zinc-600 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}