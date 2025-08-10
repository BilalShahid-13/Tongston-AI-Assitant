// lib/data-parser.ts
export function parseLessonMetadata(markdown: string) {
  const metadata: Record<string, string> = {}
  const lines = markdown.split("\n")
  for (const line of lines) {
    const match = line.match(/^- \*\*([^:]+)\*\*:\s*(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      metadata[key] = value
    }
  }
  return metadata
}
