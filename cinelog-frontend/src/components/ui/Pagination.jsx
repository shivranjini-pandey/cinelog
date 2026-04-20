export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null
  
    return (
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-30
                     hover:bg-gray-700 transition-colors text-sm"
        >
          Previous
        </button>
        <span className="text-gray-400 text-sm">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-30
                     hover:bg-gray-700 transition-colors text-sm"
        >
          Next
        </button>
      </div>
    )
  }