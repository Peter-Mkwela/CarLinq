'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Cpu, HardDrive, Palette, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientDashboard() {
  const [, setClientEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('clientEmail');
    if (!email) {
      router.push('/client/dashboard');
    } else {
      setClientEmail(email);
    }
  }, [router]);

  // Show zero when there’s no data
  const stats = [
    { label: 'Active Requests', value: 0 },
    { label: 'Completed Services', value: 0 },
    { label: 'Pending Payments', value: 0 },
    { label: 'Support Tickets', value: 0 },
  ];

  const services = [
    { name: 'Web Development', icon: Globe, description: 'Professional websites and web apps' },
    { name: 'Data Recovery', icon: HardDrive, description: 'HDD, SSD, USB data retrieval' },
    { name: 'Software Development', icon: Cpu, description: 'Custom software solutions' },
    { name: 'Graphics Design', icon: Palette, description: 'Logos, flyers, posters' },
    { name: 'IT Support', icon: Cpu, description: 'Hardware & software troubleshooting' },
    { name: 'OS Installation', icon: HardDrive, description: 'Windows 10/11 installations' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Welcome back! Here’s your activity summary and available services.
        </p>
      </motion.div>

      {/* Stats Grid (always shown, default 0 values) */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900 rounded-xl p-4 sm:p-5 shadow border border-gray-800 text-center hover:border-orange-500 transition"
          >
            <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm sm:text-base text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Services */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="bg-gray-900 rounded-xl p-5 sm:p-6 border border-gray-800 shadow">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-5">Available Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="p-4 border border-gray-700 rounded-lg bg-gray-900 hover:border-orange-500 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-base">{service.name}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">{service.description}</p>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all text-sm">
                  <Plus className="w-4 h-4 inline-block mr-1" />
                  Order
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
