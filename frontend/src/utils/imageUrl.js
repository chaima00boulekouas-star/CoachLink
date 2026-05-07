/**
 * Build a proper image URL from a stored image path.
 * Handles:
 *  - Full URLs (http/https) — returned as-is
 *  - Relative paths like "uploads/filename.webp" — prefixed with backend URL
 *  - Old absolute Windows paths — extracts filename and builds URL
 */
export const getImageUrl = (imgPath, fallbackOrGender = null) => {
  // If imgPath is missing or invalid
  if (!imgPath || typeof imgPath !== 'string' || imgPath.trim() === '') {
    const gender = String(fallbackOrGender || '').toLowerCase();
    
    // If a full URL was provided as fallback
    if (fallbackOrGender && typeof fallbackOrGender === 'string' && fallbackOrGender.startsWith('http')) {
      return fallbackOrGender;
    }
    
    // Very reliable secondary fallback (UI Avatars)
    return 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=User';
  }

  // Already a full URL or Data URI
  if (imgPath.startsWith('http') || imgPath.startsWith('data:')) {
    return imgPath;
  }
  
  // Handle backend uploads - normalize slashes to forward slashes first
  const normalizedPath = imgPath.replace(/\\/g, '/').replace(/^\//, '');
  
  if (normalizedPath.startsWith('uploads/')) {
    return `http://localhost:5000/${normalizedPath}`;
  }

  // If it's just a filename, assume it's in the uploads folder
  const filename = normalizedPath.split('/').pop();
  return `http://localhost:5000/uploads/${filename}`;
};

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1546519638405-a2c5ba50a55b?auto=format&fit=crop&q=80&w=400';
