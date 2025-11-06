/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useTheme } from '@/app/providers/theme-provider';
import { useRouter } from 'next/navigation';


export default function DealerLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dealer dashboard
      router.push('/dealers/dealer-dashboard');
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    // Handle Google OAuth integration here
    console.log('Google Sign-In clicked');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-gray-900/80"
        style={{
          backgroundImage: "url('/background/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold tracking-tight select-none"
              >
                <span
                  className="inline-block italic transform skew-x-[10deg]"
                  style={{
                    color: theme === 'light' ? '#FF8C00' : '#CC6600',
                    textShadow: `
                      0 2px 0 #000,
                      1px 1px 0 rgba(0,0,0,0.3),
                      2px 2px 0 rgba(0,0,0,0.2)
                    `,
                    fontWeight: 800,
                  }}
                >
                  Cɑr
                </span>
                <span
                  className="inline-block italic transform skew-x-[10deg]"
                  style={{
                    color: theme === 'light' ? '#0277BD' : '#01579B',
                    textShadow: `
                      0 2px 0 #000,
                      1px 1px 0 rgba(0,0,0,0.3),
                      2px 2px 0 rgba(0,0,0,0.2)
                    `,
                    fontWeight: 800,
                    marginLeft: '0.1rem',
                  }}
                >
                  Linq
                </span>
              </motion.h1>
              <p className="mt-2 text-white/80 text-sm">
                Dealer Portal
              </p>
            </div>

            {/* Google Sign-In Button */}
            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 mb-6 border border-white/30 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </motion.button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-white/60 bg-transparent">Or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
    Email
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Mail className="h-5 w-5 text-orange-400" /> {/* icon now orange */}
    </div>
    <input
      id="email"
      name="email"
      type="email"
      required
      value={formData.email}
      onChange={handleChange}
      className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
      placeholder="your@dealership.com"
    />
  </div>
</div>

{/* Password Field */}
<div>
  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
    Password
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Lock className="h-5 w-5 text-orange-400" /> {/* icon now orange */}
    </div>
    <input
      id="password"
      name="password"
      type={showPassword ? 'text' : 'password'}
      required
      value={formData.password}
      onChange={handleChange}
      className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
      placeholder="Enter your password"
    />
    <button
      type="button"
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5 text-white/60 hover:text-white" />
      ) : (
        <Eye className="h-5 w-5 text-white/60 hover:text-white" />
      )}
    </button>
  </div>
</div>


              {/* Submit Button */}
              <div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign in to Dashboard'
                  )}
                </motion.button>
              </div>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                New dealer?{' '}
                <Link
                  href="/dealers/dealer-register"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}