/**
 * Calculate text similarity between two strings
 * This is a simple implementation using cosine similarity of word frequencies
 * In a production environment, you would use a more sophisticated NLP approach
 * or integrate with an AI service
 */
export function calculateTextSimilarity(text1: string, text2: string, keywords: string[] = []): number {
  // Normalize texts: lowercase, remove punctuation, split into words
  const normalizeText = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 0)
  }

  const words1 = normalizeText(text1)
  const words2 = normalizeText(text2)

  // Create word frequency maps
  const freqMap1: Record<string, number> = {}
  const freqMap2: Record<string, number> = {}

  // Count frequencies in text1
  for (const word of words1) {
    freqMap1[word] = (freqMap1[word] || 0) + 1
  }

  // Count frequencies in text2
  for (const word of words2) {
    freqMap2[word] = (freqMap2[word] || 0) + 1
  }

  // Get all unique words
  const allWords = new Set([...Object.keys(freqMap1), ...Object.keys(freqMap2)])

  // Calculate cosine similarity
  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  // Apply keyword weighting
  const keywordWeight = 2.0 // Keywords are twice as important
  const normalWordWeight = 1.0

  for (const word of allWords) {
    // Apply higher weight to keywords
    const weight = keywords.includes(word) ? keywordWeight : normalWordWeight

    const freq1 = (freqMap1[word] || 0) * weight
    const freq2 = (freqMap2[word] || 0) * weight

    dotProduct += freq1 * freq2
    magnitude1 += freq1 * freq1
    magnitude2 += freq2 * freq2
  }

  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)

  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  // Calculate cosine similarity (0-1) and convert to percentage
  const similarity = dotProduct / (magnitude1 * magnitude2)
  return Math.round(similarity * 100)
}

/**
 * More advanced similarity calculation that could be used with an AI API
 * This is a placeholder for integration with services like OpenAI
 */
export async function calculateAISimilarity(studentAnswer: string, modelAnswer: string): Promise<number> {
  // In a real implementation, you would call an AI API here
  // For example, using OpenAI's embeddings API:

  // const response = await fetch('https://api.openai.com/v1/embeddings', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     input: [studentAnswer, modelAnswer],
  //     model: "text-embedding-ada-002"
  //   })
  // });

  // const data = await response.json();
  // const embeddings = data.data.map((item: any) => item.embedding);

  // Then calculate cosine similarity between the embeddings

  // For now, we'll use our simple implementation
  return calculateTextSimilarity(studentAnswer, modelAnswer)
}
