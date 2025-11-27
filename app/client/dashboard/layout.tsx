'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Download,
  MessageSquare,
  CreditCard,
  FolderOpen,
  Home,
  BarChart3,
  Menu,
  X,
  User,
  LogOut,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string }>({});
  const menuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('clientUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clientUser');
    router.push('/');
  };

  const navigation = [
    { name: 'Overview', href: '/client/dashboard', icon: Home },
    { name: 'Services', href: '/client/dashboard/services', icon: BarChart3 },
    { name: 'My Orders', href: '/client/dashboard/orders', icon: FolderOpen },
    { name: 'Payments', href: '/client/dashboard/payments', icon: CreditCard },
    { name: 'Downloads', href: '/client/dashboard/downloads', icon: Download },
    { name: 'Support', href: '/client/dashboard/support', icon: MessageSquare },
  ];

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close both menus when any menu is open and clicking on overlay
  const handleOverlayClick = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 flex flex-col">
      {/* Overlay for mobile menus */}
      {(isMenuOpen || isUserMenuOpen) && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800 p-4 sticky top-0 z-50 flex justify-between items-center">
        {/* Left: Hamburger Menu (Navigation only) */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-400 hover:text-white z-50 relative"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Navigation Dropdown - Made Larger */}
          {isMobile && isMenuOpen && (
            <div className="fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 shadow-2xl w-80 z-50 transform transition-transform duration-300 ease-in-out">
              <div className="px-6 py-6 border-b border-gray-800 bg-gray-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFA500] to-[#FF8C00] flex items-center justify-center text-white font-semibold text-lg">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white truncate">{user.name || 'Client User'}</p>
                    <p className="text-sm text-gray-400 truncate">{user.email || 'client@email.com'}</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-white">Navigation Menu</p>
              </div>

              <div className="h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pb-6">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleNavigation}
                      className={`flex items-center gap-3 px-6 py-4 text-base transition-all duration-200 border-b border-gray-800 last:border-b-0 ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-lg border-l-4 border-l-orange-300'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:border-l-4 hover:border-l-gray-600'
                      }`}
                    >
                      <item.icon className="w-6 h-6 flex-shrink-0" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* User actions at bottom of navigation */}
                <div className="mt-8 px-6 space-y-2">
                  <Link
                    href="/client/dashboard/profile"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleNavigation();
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-base text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: User Avatar with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={handleUserMenuClick}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFA500] to-[#FF8C00] flex items-center justify-center text-white hover:opacity-90 transition-opacity z-50 relative font-semibold"
          >
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-56 z-50">
              <div className="px-4 py-3 border-b border-gray-800 bg-gray-900">
                <p className="text-sm font-medium text-white truncate">{user.name || 'Client User'}</p>
                <p className="text-xs text-gray-400 truncate mt-1">{user.email || 'client@email.com'}</p>
              </div>

              <Link
                href="/client/dashboard/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 rounded-b-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content with blur effect when menu is open */}
      <div className={`flex-1 transition-all duration-300 ${
        (isMenuOpen || isUserMenuOpen) && isMobile ? 'blur-sm brightness-50' : ''
      }`}>
        {/* Desktop Sidebar (Persistent) */}
        <div className="hidden lg:flex min-h-screen">
          <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="px-4 py-4 border-b border-gray-800">
              <p className="text-sm font-medium text-white truncate">{user.name || 'Client User'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email || 'client@email.com'}</p>

              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/client/dashboard/profile"
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white rounded text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">{children}</main>
        </div>

        {/* Mobile Main */}
        {isMobile && <main className="flex-1 p-4 min-h-screen">{children}</main>}
      </div>
    </div>
  );
}