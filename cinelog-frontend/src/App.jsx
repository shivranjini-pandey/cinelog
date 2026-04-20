import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home        from './pages/Home'
import Search      from './pages/Search'
import MovieDetail from './pages/MovieDetail'
import Login       from './pages/Login'
import Register    from './pages/Register'
import Profile     from './pages/Profile'
import Watchlist   from './pages/Watchlist'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/search"             element={<Search />} />
          <Route path="/movie/:tmdb_id"     element={<MovieDetail />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/profile/:username"  element={<Profile />} />
          <Route path="/watchlist"          element={
            <ProtectedRoute><Watchlist /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}