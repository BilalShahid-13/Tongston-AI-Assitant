export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, aVal, index) => sum + aVal * b[index]);
  const normA = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0));
  const normB = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0));
  return dotProduct / (normA * normB);
}