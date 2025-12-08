export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('car_session_id');
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('car_session_id', sessionId);
  }
  
  return sessionId;
}