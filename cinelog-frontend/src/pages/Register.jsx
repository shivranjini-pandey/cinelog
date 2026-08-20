import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Film } from 'lucide-react'
import { register as registerApi } from '../services/authService'
import { login as loginApi, getMe } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function Register() {
  const { login }               = useAuth()
  const navigate                = useNavigate()
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
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
    <div className="min-h-screen bg-black pt-20 flex items-center justify-center">

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Film className="w-10 h-10 text-purple-500" />
            <span className="text-4xl tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              CineLog
            </span>
          </div>
          <p className="text-gray-400 text-lg">Create your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.3)]">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-gray-300 mb-2">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                minLength={3}
                maxLength={30}
                required
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                minLength={8}
                required
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
              />
            </div>

            <ErrorMessage message={error} />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] transition-all duration-300"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}