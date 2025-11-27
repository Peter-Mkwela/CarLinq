// app/dashboard/orders/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';

export default function OrdersPage() {
  const orders = [
    { id: '#001', service: 'Data Recovery', status: 'In Progress', date: '2024-01-15', amount: '$150' },
    { id: '#002', service: 'Website Design', status: 'Completed', date: '2024-01-10', amount: '$300' },
    { id: '#003', service: 'Software Development', status: 'Pending', date: '2024-01-18', amount: '$500' },
    { id: '#004', service: 'Graphics Design', status: 'In Progress', date: '2024-01-12', amount: '$200' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'In Progress': return Clock;
      default: return AlertCircle;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track your service requests and their status</p>
        </motion.div>

        {/* Orders Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{order.service}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${
                            order.status === 'Completed' ? 'text-green-400' :
                            order.status === 'In Progress' ? 'text-blue-400' :
                            'text-yellow-400'
                          }`} />
                          <span className={`text-sm ${
                            order.status === 'Completed' ? 'text-green-400' :
                            order.status === 'In Progress' ? 'text-blue-400' :
                            'text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{order.date}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">{order.amount}</td>
                      <td className="px-6 py-4">
                        <button className="text-orange-400 hover:text-orange-500 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}