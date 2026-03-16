/**
 * Rich text utilities — ensure filled content is never stripped as null/empty.
 * Use for forms that submit HTML from TipTap/ProseMirror editors.
 */

/** Strip HTML tags to get plain text. SSR-safe. Use for meta descriptions, etc. */
export function stripHtmlToText(html: string | null | undefined): string {
  if (html == null || typeof html !== 'string') return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True if the HTML has actual text content (not just empty tags/whitespace) */
export function hasRichTextContent(html: string | null | undefined): boolean {
  return stripHtmlToText(html ?? '').length > 0
}

/**
 * Normalize rich text for API submit.
 * - If it has content: return as-is (never null, never '')
 * - If empty: return ''
 */
export function normalizeRichTextForSubmit(
  value: string | null | undefined
): string {
  if (value == null) return ''
  const s = String(value).trim()
  if (!s) return ''
  if (!hasRichTextContent(s)) return ''
  return s
}
