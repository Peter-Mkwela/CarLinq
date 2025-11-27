// app/dashboard/services/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Plus, Globe, HardDrive, Cpu, Palette, Server, Download } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { name: 'Web Development', icon: Globe, description: 'Professional websites and web applications' },
    { name: 'Data Recovery', icon: HardDrive, description: 'HDD, SSD, USB data retrieval' },
    { name: 'Software Development', icon: Cpu, description: 'Custom software solutions' },
    { name: 'Graphics Design', icon: Palette, description: 'Logos, flyers, posters' },
    { name: 'IT Support', icon: Server, description: 'Hardware & software troubleshooting' },
    { name: 'OS Installation', icon: Download, description: 'Windows 10/11 professional installation' }
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Our Services</h1>
          <p className="text-gray-400">Browse and order from our professional IT services</p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-orange-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{service.name}</h3>
              </div>
              
              <p className="text-gray-400 mb-6">{service.description}</p>
              
              <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Order Service
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}