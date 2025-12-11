'use client'
export const dynamic = 'force-dynamic';;

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Phone, User, Building } from 'lucide-react';
import { useTheme } from '@/app/providers/theme-provider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DealerRegister() {
  const [formData, setFormData] = useState({
    dealerName: '',
    companyName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/dealers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Account created successfully! You can now login.');
        // Optionally clear form
        setFormData({
          dealerName: '',
          companyName: '',
          email: '',
          password: '',
          phone: '',
        });
        // Redirect to login after success
        setTimeout(() => router.push('/dealers/login'), 2000);
      } else {
        toast.error(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
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

          {/* Register Card */}
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
                  CÉ‘r
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
                Dealer Registration
              </p>
            </div>

            {/* Register Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Dealer Name Field */}
              <div>
                <label htmlFor="dealerName" className="block text-sm font-medium text-white mb-2">
                  Dealer Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-orange-400" />
                  </div>
                  <input
                    id="dealerName"
                    name="dealerName"
                    type="text"
                    required
                    value={formData.dealerName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              {/* Company Name Field */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-white mb-2">
                  Dealership Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-orange-400" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Premium Auto Dealers"
                  />
                </div>
              </div>

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

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-orange-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="+263 xxx xxx xxx"
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
                    placeholder="Create a password"
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
                      Creating Account...
                    </div>
                  ) : (
                    'Create Dealer Account'
                  )}
                </motion.button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{' '}
                <Link
                  href="/dealers/login"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
