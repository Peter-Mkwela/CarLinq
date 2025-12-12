/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { signIn, useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { useTheme } from '@/app/providers/theme-provider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Suspense } from 'react';
import Link from 'next/link';

// Wrap the main component with Suspense
export default function AdminLogin() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <AdminLoginContent />
    </Suspense>
  );
}

// Move all the logic to this inner component
function AdminLoginContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  
  // Get session from NextAuth
  const { data: session, status } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use NextAuth credentials provider with role validation
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        role: 'ADMIN', // Add this to ensure only admins can login
      });

      if (result?.error) {
        toast.error('Invalid credentials or insufficient permissions');
      } else {
        toast.success('Admin login successful!');
        // The useEffect below will handle the redirect after session validation
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Redirect only if session is valid and user is ADMIN
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Check if session has valid user data and ADMIN role
      if (session.user?.id && session.user.id !== '' && session.user.role === 'ADMIN') {
        setTimeout(() => router.push('/admin/admin-dashboard'), 1000);
      } else if (session.user?.id && session.user.role !== 'ADMIN') {
        // User is not an admin - clear session and show error
        console.log('❌ Non-admin user trying to access admin portal');
        signOut({ redirect: false });
        toast.error('Access denied. Admin privileges required.');
      } else {
        // Session exists but user is invalid/deleted
        signOut({ redirect: false });
        toast.error('Your account was not found. Please login again.');
      }
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return <LoginSkeleton />;
  }

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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight select-none italic transition-colors duration-300"
              >
                {/* Car - Dark Bold Orange with black vertical line */}
                <span
                  className="ml-0"
                  style={{
                    color: theme === 'light' ? '#FF8C00' : '#CC6600',
                    textShadow: `
                      0 2px 0 #000,
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
                    color: theme === 'light' ? '#0277BD' : '#01579B',
                    textShadow: `
                      0 2px 0 #000,
                      1px 1px 0 rgba(0,0,0,0.3), 
                      2px 2px 0 rgba(0,0,0,0.2)
                    `,
                  }}
                >
                  Linq
                </span>
              </motion.h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Shield className="w-5 h-5 text-orange-400" />
                <p className="text-white/80 text-sm">
                  Admin Portal
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-200 text-sm font-medium">Restricted Access</p>
                  <p className="text-gray-400 text-xs mt-1">Authorized personnel only</p>
                </div>
              </div>
            </motion.div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-orange-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="admin@carlinq.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-orange-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter admin password"
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
                      Authenticating...
                    </div>
                  ) : (
                    'Access Admin Dashboard'
                  )}
                </motion.button>
              </div>
            </form>

            {/* Back to Home Link */}
            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                <Link
                  href="/"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Back to Home
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader for the Suspense fallback
function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Loading admin login...</div>
    </div>
  );
}