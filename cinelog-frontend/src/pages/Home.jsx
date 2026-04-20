export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-zinc-100 mb-2">
          CineLog
        </h1>
        <p className="text-zinc-400 text-base">
          Discover, review, and track the films you love.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
        <p className="text-zinc-300">
          Browse movies by genre, search for titles, and share your reviews.
        </p>
      </div>
    </div>
  )
}