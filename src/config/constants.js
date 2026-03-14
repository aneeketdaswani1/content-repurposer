export const PLATFORMS = [
  { id: "twitter", label: "𝕏 Thread", icon: "𝕏", color: "#000000", bg: "#f7f7f7" },
  { id: "linkedin", label: "LinkedIn", icon: "in", color: "#0A66C2", bg: "#EEF3F8" },
  { id: "newsletter", label: "Newsletter", icon: "✉", color: "#D44638", bg: "#FFF5F5" },
  { id: "instagram", label: "Instagram", icon: "📸", color: "#E1306C", bg: "#FFF0F6" },
  { id: "youtube", label: "YouTube", icon: "▶", color: "#FF0000", bg: "#FFF5F5" },
  { id: "podcast", label: "Podcast", icon: "🎙", color: "#8B5CF6", bg: "#F5F3FF" },
];

export const TONES = [
  { id: "professional", label: "Professional", emoji: "👔" },
  { id: "casual", label: "Casual", emoji: "😎" },
  { id: "humorous", label: "Humorous", emoji: "😂" },
  { id: "inspirational", label: "Inspirational", emoji: "🔥" },
  { id: "educational", label: "Educational", emoji: "📚" },
  { id: "storytelling", label: "Storytelling", emoji: "📖" },
];

export const ANALYSIS_PROMPT = `You are an expert NLP content analyst. Analyze the given content and return ONLY a valid JSON object with no markdown, no backticks.
{
  "summary": "A compelling 2-sentence TL;DR of the content",
  "sentiment": { "label": "positive|negative|neutral|mixed", "score": 0.0 to 1.0, "explanation": "One sentence why" },
  "readability": { "level": "elementary|intermediate|advanced|expert", "score": 1-100, "gradeLevel": "Grade X or equivalent" },
  "tone": { "primary": "informative|persuasive|conversational|formal|humorous|inspirational", "secondary": "another tone", "confidence": 0.0 to 1.0 },
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "namedEntities": [{ "text": "entity", "type": "PERSON|ORG|TECH|LOCATION|DATE|CONCEPT" }],
  "topicClassification": { "primary": "main topic category", "secondary": "sub topic", "tags": ["tag1", "tag2", "tag3"] },
  "emotionalTone": { "dominant": "excitement|curiosity|urgency|calm|empathy|authority", "intensity": 0.0 to 1.0 },
  "contentMetrics": { "informationDensity": "low|medium|high", "actionability": "low|medium|high", "originalitySignal": "low|medium|high" },
  "seo": { "suggestedTitle": "SEO-optimized title under 60 chars", "metaDescription": "Meta description under 155 chars", "slug": "url-friendly-slug", "primaryKeyword": "main keyword", "secondaryKeywords": ["kw1", "kw2", "kw3"], "estimatedSearchVolume": "low|medium|high" },
  "platformPrediction": {
    "bestPlatform": "twitter|linkedin|instagram|youtube|newsletter|podcast",
    "reasoning": "One sentence why this platform fits best",
    "scores": { "twitter": 0-100, "linkedin": 0-100, "instagram": 0-100, "youtube": 0-100, "newsletter": 0-100, "podcast": 0-100 }
  }
}`;

export const REPURPOSE_PROMPT = `You are a world-class content repurposing expert. Given content and a tone, transform it into platform-specific formats using that exact tone.
IMPORTANT: Return ONLY a valid JSON object. No markdown, no backticks, no explanation.
{
  "twitter": "A Twitter/X thread. Numbered tweets (1/ 2/ 3/). Each under 280 chars. 5-8 tweets. Punchy hooks.",
  "linkedin": "Professional LinkedIn post. Bold hook. Short paragraphs. Emojis sparingly. End with question. 150-300 words.",
  "newsletter": "Email newsletter. Start with 'Hey there,' greeting. TL;DR at top. Scannable sections. CTA at end. 200-400 words.",
  "instagram": "Instagram caption. Hook first. Short punchy lines. Emojis. 5-8 hashtags at end. Under 200 words.",
  "youtube": "YouTube description. First 2 lines are hook. Timestamps placeholder. Keywords. Subscribe CTA. 150-250 words.",
  "podcast": "Podcast show notes. Episode title, 3-bullet takeaways, 2-3 sentence summary, 3-5 discussion questions."
}`;