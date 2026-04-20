export default function MovieFilters({ genres, activeGenre, onSelect }) {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeGenre === null
              ? 'bg-green-500 text-black'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Trending
        </button>
        {genres.map(g => (
          <button
            key={g.id}
            onClick={() => onSelect(g.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeGenre === g.id
                ? 'bg-green-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>
    )
  }