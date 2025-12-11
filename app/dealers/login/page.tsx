/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
export const dynamic = 'force-dynamic';;

import { useState, useEffect } from 'react';
import { signIn, useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useTheme } from '@/app/providers/theme-provider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Suspense } from 'react';

// Wrap the main component with Suspense
export default function DealerLogin() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <DealerLoginContent />
    </Suspense>
  );
}

// Move all the logic to this inner component
function DealerLoginContent() {
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
      // Use NextAuth credentials provider instead of custom API
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials, please try again.');
      } else {
        toast.success('Login successful! Redirecting...');
        // The useEffect below will handle the redirect after session validation
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn('google', { 
      callbackUrl: '/dealers/dealer-dashboard',
      redirect: true 
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // âœ… FIXED: Redirect only if session is valid (user exists in DB)
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Check if session has valid user data (not empty IDs from deleted users)
      if (session.user?.id && session.user.id !== '') {
        toast.success('Login successful! Redirecting...');
        setTimeout(() => router.push('/dealers/dealer-dashboard'), 1000);
      } else {
        // Session exists but user is invalid/deleted - clear it
        console.log('ðŸ”„ Clearing invalid session...');
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
              <p className="mt-2 text-white/80 text-sm">
                Dealer Portal
              </p>
            </div>

            {/* Google Sign-In Button */}
            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 mb-6 
                         border border-gray-300 rounded-lg bg-white text-gray-700 
                         hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
            >
              {/* Google Icon */}
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.34 30.47 0 24 0 14.62 0 6.51 5.42 2.59 13.26l7.98 6.2C12.46 13.07 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.29-.47-4.88H24v9.23h12.7c-.56 2.93-2.24 5.41-4.75 7.07l7.28 5.65C43.53 37.49 46.5 31.44 46.5 24.5z"/>
                <path fill="#FBBC05" d="M10.57 28.46c-.57-1.69-.9-3.5-.9-5.46s.33-3.77.9-5.46l-7.98-6.2C.92 15.68 0 19.98 0 24s.92 8.32 2.59 12.66l7.98-6.2z"/>
                <path fill="#34A853" d="M24 48c6.47 0 11.93-2.13 15.91-5.79l-7.28-5.65c-2.02 1.39-4.62 2.17-7.63 2.17-6.27 0-11.56-3.57-13.43-8.76l-7.98 6.2C6.51 42.58 14.62 48 24 48z"/>
              </svg>

              {isLoading ? "Signing in..." : "Sign in with Google"}
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

// Skeleton loader for the Suspense fallback
function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Loading login form...</div>
    </div>
  );
}
