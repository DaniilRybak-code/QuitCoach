/**
 * Avatar Service
 * Handles avatar generation using DiceBear API with fallbacks
 */

// Avatar generation utility with fallback
export function generateAvatar(seed: string, style: string = 'adventurer'): string {
  // Using DiceBear API for reliable avatar generation
  const baseUrl = 'https://api.dicebear.com/7.x';
  const options = {
    seed: seed || Math.random().toString(36).substring(7),
    backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc'],
    radius: 50,
    size: 200
  };
  
  const queryParams = new URLSearchParams(options as any).toString();
  return `${baseUrl}/${style}/svg?${queryParams}`;
}

// Fallback avatar generation using local SVG
export function generateFallbackAvatar(seed: string): string {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const color = colors[seed.charCodeAt(0) % colors.length];
  const initials = seed.substring(0, 2).toUpperCase();
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${color}"/>
      <text x="100" y="120" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="white">${initials}</text>
    </svg>
  `)}`;
}

/**
 * Process a photo file and convert it to an anime-style avatar
 */
export async function processPhotoToAnime(photoPreview: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    img.onload = () => {
      canvas.width = 200;
      canvas.height = 200;
      
      // Apply anime-style filters
      ctx.filter = 'contrast(1.2) saturate(1.3) brightness(1.1)';
      ctx.drawImage(img, 0, 0, 200, 200);
      
      // Add anime-style effects
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255, 200, 200, 0.1)';
      ctx.fillRect(0, 0, 200, 200);
      
      // Convert to data URL
      const animeAvatar = canvas.toDataURL('image/png');
      resolve(animeAvatar);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = photoPreview;
  });
}

/**
 * Read a file and convert to data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

