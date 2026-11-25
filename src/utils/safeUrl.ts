/**
 * Validates and sanitizes dynamic URLs before rendering them in href/src attributes.
 * Blocks dangerous schemes (javascript:, data:, vbscript:) and protocol-relative URLs (//...).
 */
export function sanitizeHref(rawUrl: string | null | undefined): string | undefined {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  // Reject control characters and protocol-relative URLs
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return undefined;
  if (trimmed.startsWith('//')) return undefined;

  // Allow safe root-relative paths (e.g. /uploads/..., /assets/...)
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    return undefined;
  }

  return undefined;
}
