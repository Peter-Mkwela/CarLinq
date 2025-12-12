/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Lock,
  Save,
  X,
  Shield,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Key
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  address?: string;
  isVerified: boolean;
  createdAt?: string;
}

interface ProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData: ProfileData;
}

export default function ProfileForm({ isOpen, onClose, onSave, initialData }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<ProfileData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Check if user has password (manual sign-in vs OAuth)
  const hasPassword = session?.user?.id ? true : false; // You'll need to fetch this from your API

  useEffect(() => {
    setProfile(initialData);
    setIsEditing(false);
    setChangePassword(false);
  }, [initialData]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update profile
      const response = await fetch('/api/dealers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: profile.id,
          name: profile.name,
          phone: profile.phone || '',
          companyName: profile.companyName || '',
          address: profile.address || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      const updatedProfile = await response.json();

      // Update password if requested and user has password
      if (changePassword && passwordData.newPassword && hasPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const passwordResponse = await fetch('/api/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: profile.id,
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        });

        if (!passwordResponse.ok) {
          const error = await passwordResponse.json();
          throw new Error(error.error || 'Failed to change password');
        }
      }

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: updatedProfile.name,
          email: updatedProfile.email,
        },
      });

      onSave(updatedProfile);
      setIsEditing(false);
      setChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      ></div>

      {/* Premium Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/background/carbackground.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Header with Glass Effect */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/30 bg-white/20 text-white shadow-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white drop-shadow">
                  Dealer Profile
                </h3>
                <p className="text-white/80 text-sm mt-1 drop-shadow">
                  Manage your account information
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modern Form Content with Glass Effect */}
        <div className="p-8 max-h-[calc(90vh-140px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Header Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <User className="w-10 h-10 text-white/60" />
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow">
                  {profile.name}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-white/60" />
                  <p className="text-white/80">{profile.email}</p>
                  {profile.isVerified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      <Shield className="w-3 h-3" />
                      Verified Dealer
                    </span>
                  )}
                </div>
                {profile.createdAt && (
                  <p className="text-white/60 text-sm mt-1">
                    Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Information - Premium Grid Layout */}
            <div className="space-y-8">
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-white mb-2 drop-shadow">Personal Information</h4>
                <p className="text-white/70 text-base">Update your contact and business details</p>
              </div>
              
              {/* Modern Grid with Premium Styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="group">
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="group">
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white/60 cursor-not-allowed"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-white/40">
                      {hasPassword ? 'Manual Login' : 'Google Login'}
                    </span>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="group">
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div className="group">
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      value={profile.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                      placeholder="Your dealership name"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="group md:col-span-2">
                  <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                    Business Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-6 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <textarea
                      value={profile.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
                      placeholder="Enter your complete business address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Section - Only for manual sign-in users */}
            {hasPassword && (
              <div className="space-y-6 border-t border-white/20 pt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2 drop-shadow">Change Password</h4>
                    <p className="text-white/70 text-base">Secure your account with a new password</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setChangePassword(!changePassword);
                      if (changePassword) {
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }
                    }}
                    className={`px-4 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 ${changePassword 
                      ? 'border-primary-400 bg-primary-500/20 text-white' 
                      : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    {changePassword ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {changePassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <div className="group">
                      <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                        Current Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          required={changePassword}
                          className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                        New Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          required={changePassword}
                          minLength={6}
                          className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                          placeholder="Minimum 6 characters"
                        />
                      </div>
                    </div>

                    <div className="group md:col-span-2">
                      <label className="block text-base font-medium text-white/90 mb-3 drop-shadow">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          required={changePassword}
                          className="w-full pl-12 pr-4 py-4 text-base border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                          placeholder="Re-enter new password"
                        />
                      </div>
                      {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="text-red-300 text-sm mt-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Passwords do not match
                        </p>
                      )}
                      {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                        <p className="text-yellow-300 text-sm mt-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Password must be at least 6 characters
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Information for OAuth users */}
            {!hasPassword && (
              <div className="border-t border-white/20 pt-8">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-300 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Google Account</h4>
                      <p className="text-white/80 text-base">
                        You're signed in with Google. To change your email or password, 
                        please update your Google account settings.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                        Your email and basic profile information are managed by Google
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-white/20">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium text-base flex items-center justify-center gap-3"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={(!isEditing && !changePassword) || isLoading}
                className="flex-1 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary-500/25 text-base flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}