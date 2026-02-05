/**
 * Format bytes to human-readable string
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get color code based on size
 * Green for small (<100KB), Yellow for medium (<1MB), Red for large
 */
export function getSizeColor(bytes: number): string {
  if (bytes < 100 * 1024) return '\x1b[32m'; // Green
  if (bytes < 1024 * 1024) return '\x1b[33m'; // Yellow
  return '\x1b[31m'; // Red
}

export const RESET = '\x1b[0m';
export const BOLD = '\x1b[1m';
export const DIM = '\x1b[2m';
