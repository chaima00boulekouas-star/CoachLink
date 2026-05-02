/**
 * Build a proper image URL from a stored image path.
 * Handles:
 *  - Full URLs (http/https) — returned as-is
 *  - Relative paths like "uploads/filename.webp" — prefixed with backend URL
 *  - Old absolute Windows paths — extracts filename and builds URL
 */
export const getImageUrl = (imgPath, fallback = null) => {
  if (!imgPath) return fallback;
  // Already a full URL
  if (imgPath.startsWith('http')) return imgPath;
  // Relative path
  if (imgPath.startsWith('uploads/')) return `http://localhost:5000/${imgPath}`;
  // Absolute path — extract filename
  const filename = imgPath.split(/[\\/]/).pop();
  return `http://localhost:5000/uploads/${filename}`;
};

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1546519638405-a2c5ba50a55b?auto=format&fit=crop&q=80&w=400';
