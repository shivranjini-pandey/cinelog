export default function MovieFilters({ genres, activeGenre, onSelect }) {
  return (
    <div className="w-full px-8 py-16">

      {/* Title */}
      <h2 className="text-3xl font-semibold text-white mb-8">
        Browse by Genre
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4">

        {/* 🔥 Trending */}
        <button
          onClick={() => onSelect(null)}
          className={`h-28 rounded-xl flex items-center justify-center text-sm font-medium transition-all
            ${
              activeGenre === null
                ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                : "bg-gradient-to-br from-purple-900/40 to-pink-900/40 text-gray-300 hover:scale-105 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] backdrop-blur-sm border border-purple-500/20"
            }`}
        >
          Trending
        </button>

        {/* Genres */}
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => onSelect(g.id)}
            className={`h-28 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300
              ${
                activeGenre === g.id
                  ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-105 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                  : "bg-gradient-to-br from-purple-900/40 to-pink-900/40 text-gray-300  hover:from-purple-700/60 hover:to-pink-700/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 backdrop-blur-sm border border-purple-500/20"
              }`}
          >
            {g.name}
          </button>
        ))}

      </div>
    </div>
  )
}