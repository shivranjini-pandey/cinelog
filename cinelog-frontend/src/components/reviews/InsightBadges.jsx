const SENTIMENT_STYLES = {
    positive: 'bg-green-900/50 text-green-300 border-green-700',
    negative: 'bg-red-900/50  text-red-300  border-red-700',
    mixed:    'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  }
  
  export default function InsightBadges({ insights }) {
    if (!insights?.sentiment) return null
  
    const sentimentStyle = SENTIMENT_STYLES[insights.sentiment] || SENTIMENT_STYLES.mixed
    const themes = insights.themes
      ? insights.themes.split(',').map(t => t.trim()).filter(Boolean)
      : []
  
    return (
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${sentimentStyle}`}>
            {insights.sentiment}
          </span>
          {themes.map(theme => (
            <span
              key={theme}
              className="text-xs px-2.5 py-1 rounded-full border
                         bg-gray-800 text-gray-400 border-gray-600"
            >
              {theme}
            </span>
          ))}
        </div>
        {insights.verdict && (
          <p className="text-gray-500 text-xs italic">
            "{insights.verdict}"
          </p>
        )}
      </div>
    )
  }