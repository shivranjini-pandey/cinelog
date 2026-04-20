import { useState } from 'react'

export default function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div className="flex gap-1">
      {Array.from({ length: 10 }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-2xl transition-colors ${
            star <= display ? 'text-yellow-400' : 'text-gray-600'
          } ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-gray-400 text-sm self-center">{value}/10</span>
      )}
    </div>
  )
}