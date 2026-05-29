import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import MovieCard from "../components/movies/MovieCard"
import MovieFilters from "../components/movies/MovieFilters"

import { getTrending, getGenres, getByGenre } from "../services/movieService"

export default function Home() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [activeGenre, setActiveGenre] = useState(null)

  const navigate = useNavigate()

  // Load genres once
  useEffect(() => {
    getGenres().then(res => setGenres(res.data))
  }, [])

  // Load movies based on active genre
  useEffect(() => {
    if (activeGenre === null) {
      getTrending().then(res => setMovies(res.data.results))
    } else {
      getByGenre(activeGenre).then(res => setMovies(res.data.results))
    }
  }, [activeGenre])

  return (
    <div className="min-h-screen bg-black pt-28">

      {/* Hero section */}
      <div className="relative h-[550px] overflow-hidden">

        {/* Poster collage */}
        <div className="absolute inset-0 grid grid-cols-4 gap-1 opacity-20">
          {movies.slice(0, 8).map(movie => (
            <img
              key={movie.tmdb_id}
              src={movie.poster_url}
              alt=""
              className="w-full h-[275px] object-cover"
            />
          ))}
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black/80 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/20 to-blue-900/20" />

        {/* Text */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
            Discover Movies. Feel Stories.
          </h1>

          <p className="text-gray-300 max-w-2xl mt-4 mb-8">
            Explore a cinematic universe of emotions, adventures, and unforgettable moments.
          </p>
        </div>
      </div>

      {/* Genre */}
      <div className="w-full px-8 py-12">
        <MovieFilters
          genres={genres}
          activeGenre={activeGenre}
          onSelect={setActiveGenre}
        />
      </div>

      {/* Movies */}
      <div className="w-full px-8 py-12">
        <h2 className="text-2xl font-semibold text-white mb-6">
          {activeGenre === null ? "Trending Now" : "Movies"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {movies.map(movie => (
            <MovieCard key={movie.tmdb_id} movie={movie} />
          ))}
        </div>
      </div>

    </div>
  )
}