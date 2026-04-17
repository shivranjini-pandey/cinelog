import httpx
import json
from app.core.config import settings

OPENAI_URL = "https://api.openai.com/v1/chat/completions"
MODEL      = "gpt-4o-mini"          # cheaper, faster model


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type":  "application/json",
    }


async def analyze_review(movie_title: str, review_content: str) -> dict | None:
    """
    Sends the review to OpenAI and gets back structured JSON with:
      - sentiment:  "positive" | "negative" | "mixed"
      - themes:     comma-separated string of up to 3 themes
      - verdict:    one plain-English sentence summary

    Returns None if the API key isn't set yet or if the call fails,
    so review submission never breaks even if AI is unavailable.
    """
    if settings.OPENAI_API_KEY in ("get_this_later", "", None):
        return None

    prompt = f"""You are analyzing a movie review. Return ONLY a JSON object with exactly 
these three keys — no explanation, no markdown, no extra text.

Movie: {movie_title}
Review: {review_content}

Return this exact structure:
{{
  "sentiment": "positive" | "negative" | "mixed",
  "themes": "comma-separated list of up to 3 themes the reviewer focused on (e.g. acting, plot, visuals, pacing, soundtrack, directing)",
  "verdict": "one sentence capturing the reviewer's overall take in plain English"
}}"""

    payload = {
        "model":       MODEL,
        "max_tokens":  256,
        "messages": [
            {
                "role":    "system",
                "content": "You are a movie review analyzer. You always respond with valid JSON only.",
            },
            {
                "role":    "user",
                "content": prompt,
            },
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(OPENAI_URL, headers=_headers(), json=payload)
            resp.raise_for_status()

        raw_text = resp.json()["choices"][0]["message"]["content"].strip()

        # strip markdown fences if the model wraps with them
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
            raw_text = raw_text.strip()

        data = json.loads(raw_text)

        return {
            "sentiment": str(data.get("sentiment", "mixed"))[:20],
            "themes":    str(data.get("themes",    ""))[:255],
            "verdict":   str(data.get("verdict",   ""))[:500],
        }

    except Exception:
        # AI failure must never block review submission
        return None