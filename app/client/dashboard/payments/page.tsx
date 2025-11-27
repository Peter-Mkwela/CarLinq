// app/dashboard/payments/page.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';

export default function PaymentsPage() {
  const payments = [
    { id: '#INV-001', order: '#001', amount: '$150', status: 'Paid', date: '2024-01-15' },
    { id: '#INV-002', order: '#002', amount: '$300', status: 'Paid', date: '2024-01-10' },
    { id: '#INV-003', order: '#003', amount: '$500', status: 'Pending', date: '2024-01-18' },
    { id: '#INV-004', order: '#004', amount: '$200', status: 'Overdue', date: '2024-01-12' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return CheckCircle;
      case 'Pending': return Clock;
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
          <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
          <p className="text-gray-400">Manage your invoices and payment history</p>
        </motion.div>

        {/* Payments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">$950</p>
                <p className="text-sm text-gray-400">Total Paid</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">$500</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">$200</p>
                <p className="text-sm text-gray-400">Overdue</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Invoice ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => {
                  const StatusIcon = getStatusIcon(payment.status);
                  return (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">{payment.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{payment.order}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">{payment.amount}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${
                            payment.status === 'Paid' ? 'text-green-400' :
                            payment.status === 'Pending' ? 'text-yellow-400' :
                            'text-red-400'
                          }`} />
                          <span className={`text-sm ${
                            payment.status === 'Paid' ? 'text-green-400' :
                            payment.status === 'Pending' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{payment.date}</td>
                      <td className="px-6 py-4">
                        {payment.status === 'Pending' && (
                          <button className="flex items-center gap-2 text-orange-400 hover:text-orange-500 transition-colors text-sm">
                            <Upload className="w-4 h-4" />
                            Upload POP
                          </button>
                        )}
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