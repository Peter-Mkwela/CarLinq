/* eslint-disable @typescript-eslint/no-unused-vars */
// components/CompleteProfileModal.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building, Phone} from 'lucide-react';
import toast from 'react-hot-toast';

interface CompleteProfileModalProps {
  isOpen: boolean;
  userEmail: string;
  onComplete: (data: { companyName: string; phone: string }) => void;
}

export default function CompleteProfileModal({ isOpen, userEmail, onComplete }: CompleteProfileModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.phone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    onComplete(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-orange-500/20 rounded-3xl w-full max-w-md shadow-2xl"
      >
        <div className="bg-gradient-to-r from-orange-500/10 via-orange-600/10 to-amber-600/10 border-b border-orange-500/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                Complete Your Profile
              </h3>
              <p className="text-orange-200/70 text-sm">Add your dealership details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-400" />
              Company Name
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-400" />
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm"
              placeholder="Enter your phone number"
            />
          
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-700 transform hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-orange-500/25"
            >
              Save Profile
            </button>
            
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}