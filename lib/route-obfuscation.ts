// lib/route-obfuscation.ts
const ROUTE_HASH = process.env.NEXT_PUBLIC_ROUTE_HASH || 'dev';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const obscuredRoutes = {
  // Dealer routes
  dealerLogin: `/d-${ROUTE_HASH}/auth`,
  dealerDashboard: `/d-${ROUTE_HASH}/dashboard`,
  dealerRegister: `/d-${ROUTE_HASH}/join`,
  
  // Admin routes  
  adminLogin: `/a-${ROUTE_HASH}/auth`,
  adminDashboard: `/a-${ROUTE_HASH}/dashboard`,
  
  // Helper to check if we should use obscured routes
  shouldUseObscured(): boolean {
    return IS_PRODUCTION;
  },
  
  // Get the actual route to use
  getRoute(type: 'dealerLogin' | 'dealerDashboard' | 'dealerRegister' | 'adminLogin' | 'adminDashboard'): string {
    if (IS_PRODUCTION) {
      return this[type];
    }
    // In development, use original routes
    const originalRoutes = {
      dealerLogin: '/dealers/login',
      dealerDashboard: '/dealers/dealer-dashboard',
      dealerRegister: '/dealers/register',
      adminLogin: '/admin/login',
      adminDashboard: '/admin/admin-dashboard',
    };
    return originalRoutes[type];
  }
};