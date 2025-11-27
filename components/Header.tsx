'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/providers/theme-provider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/cars', label: 'Browse Cars' },
    { href: '/dealers/login', label: 'For Dealers' },
    { href: '/about', label: 'About' },
  ];

  const DealerLoginButton = ({ isMobile = false }: { isMobile?: boolean }) => {
    const baseClasses = isMobile
      ? 'inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:from-primary-600 hover:to-primary-700 text-sm sm:text-base'
      : 'flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-md border border-primary-400/30 hover:from-primary-600 hover:to-primary-700';

    return (
      <Link
        href="/admin/login"
        onClick={() => setIsMenuOpen(false)}
        className={baseClasses}
        aria-label="Admin Login"
      >
        {isMobile ? (
          <>
            <User size={16} />
            <span>Admin Login</span>
          </>
        ) : (
          <User size={18} />
        )}
      </Link>
    );
  };

  const NavLink = ({
    href,
    label,
    index,
    isMobile = false,
  }: {
    href: string;
    label: string;
    index: number;
    isMobile?: boolean;
  }) => {
    const isActive = pathname === href;

    const baseClasses = isMobile
      ? `block py-3 transition-colors font-medium border-b border-gray-200 cursor-pointer text-sm sm:text-base ${
          theme === 'light' ? 'text-gray-700 hover:text-primary-600' : 'text-gray-300 hover:text-primary-400'
        }`
      : `transition-colors font-medium relative group cursor-pointer text-sm sm:text-base ${
          theme === 'light' ? 'text-gray-700 hover:text-primary-600' : 'text-gray-300 hover:text-primary-400'
        }`;

    const activeClasses = theme === 'light' ? 'text-primary-600' : 'text-primary-400';

    if (isMobile) {
      return (
        <motion.a
          key={href}
          href={href}
          onClick={() => setIsMenuOpen(false)}
          className={`${baseClasses} ${isActive ? activeClasses : ''}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {label}
        </motion.a>
      );
    } else {
      return (
        <motion.a
          key={href}
          href={href}
          className={`${baseClasses} ${isActive ? activeClasses : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {label}
          <span
            className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${
              isActive ? 'w-full' : ''
            } ${theme === 'light' ? 'bg-primary-600' : 'bg-primary-400'}`}
          ></span>
        </motion.a>
      );
    }
  };

  const ThemeToggleButton = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (isMobile) {
      return (
        <div className="flex items-center justify-between mb-4 p-3 rounded-lg border transition-colors duration-300" 
             style={{ backgroundColor: theme === 'light' ? '#f9fafb' : '#1f2937', borderColor: theme === 'light' ? '#e5e7eb' : '#374151' }}>
          <span className={`text-sm font-medium flex items-center gap-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Theme
          </span>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border flex items-center gap-2 text-sm transition-shadow duration-200 ${
              theme === 'light' ? 'bg-white text-gray-600 border-gray-300 hover:shadow-md' : 'bg-gray-800 text-gray-200 border-gray-600 hover:shadow-md'
            }`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`p-2 rounded-lg border shadow-sm hover:shadow-md text-sm sm:text-base transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white/80 text-gray-600 border-gray-300/50 hover:text-primary-600'
            : 'bg-gray-800/80 text-gray-200 border-gray-600/50 hover:text-primary-400'
        }`}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </motion.button>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 relative overflow-hidden transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] border-b border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
          : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 border-b border-gray-800 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* 3D Effect Layers */}
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
       {/* Logo */}
<Link
  href="/"
  className="flex items-center gap-2 sm:gap-3"
  onClick={() => setIsMenuOpen(false)}
>
  <motion.h1
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="text-2xl sm:text-3xl font-extrabold tracking-tight select-none italic transition-colors duration-300"
  >
    {/* Car - Dark Bold Orange with black vertical line */}
    {/* Car - using alpha a */}
<span
  className="ml-0"
  style={{
    color: theme === 'light' ? '#FF8C00' : '#CC6600', // bold dark orange
    textShadow: `
      0 2px 0 #000,  /* black vertical shadow slightly downward */
      1px 1px 0 rgba(0,0,0,0.3), 
      2px 2px 0 rgba(0,0,0,0.2)
    `,
  }}
>
  Cɑr
</span>

{/* Linq - Dark Bold Blue with black vertical shadow */}
<span
  className="ml-1"
  style={{
    color: theme === 'light' ? '#0277BD' : '#01579B', // dark blue
    textShadow: `
      0 2px 0 #000,  /* black vertical shadow slightly downward */
      1px 1px 0 rgba(0,0,0,0.3), 
      2px 2px 0 rgba(0,0,0,0.2)
    `,
  }}
>
  Linq
</span>

  </motion.h1>
</Link>


        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <NavLink key={link.href} href={link.href} label={link.label} index={index} />
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggleButton />
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden md:block">
            <DealerLoginButton />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-md"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`md:hidden transition-colors duration-300 ${
              theme === 'light' ? 'bg-gradient-to-b from-white/95 to-gray-50/95 border-t border-gray-200/50' : 'bg-gray-900/95 border-t border-gray-800/50'
            } backdrop-blur-xl`}
          >
            <div className="px-6 py-4">
              <nav className="space-y-3 mb-6">
                {navLinks.map((link, index) => (
                  <NavLink key={link.href} href={link.href} label={link.label} index={index} isMobile />
                ))}
              </nav>

              <ThemeToggleButton isMobile />

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-center">
                <DealerLoginButton isMobile />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
