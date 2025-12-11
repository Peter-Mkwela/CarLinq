/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrCreateSessionId } from '@/lib/session';

// Types
interface ToggleFavoriteResponse {
  success: boolean;
  liked: boolean;
  message: string;
  favorite?: any;
}

// Toggle favorite (like/unlike)
export async function toggleFavorite(listingId: string): Promise<ToggleFavoriteResponse> {
  const sessionId = getOrCreateSessionId();
  
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ listingId, sessionId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }
  
  return await response.json();
}

// Get all favorites for current session
export async function getMyFavorites() {
  const sessionId = getOrCreateSessionId();
  
  const response = await fetch(`/api/favorites?sessionId=${sessionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  
  return await response.json();
}

// Check if a specific listing is favorited
export async function checkIsFavorited(listingId: string): Promise<boolean> {
  const sessionId = getOrCreateSessionId();
  
  const response = await fetch(`/api/favorites/check?sessionId=${sessionId}&listingId=${listingId}`);
  
  if (!response.ok) {
    return false;
  }
  
  const data = await response.json();
  return data.isFavorited;
}