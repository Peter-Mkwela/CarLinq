// app/dashboard/support/page.tsx
'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function SupportPage() {
  const tickets = [
    { id: '#TICKET-001', subject: 'Website Loading Issues', status: 'Open', priority: 'High', date: '2024-01-15' },
    { id: '#TICKET-002', subject: 'Data Recovery Progress', status: 'Resolved', priority: 'Medium', date: '2024-01-10' },
    { id: '#TICKET-003', subject: 'Payment Confirmation', status: 'In Progress', priority: 'Low', date: '2024-01-18' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return CheckCircle;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
              <p className="text-gray-400">Get help with your services and account</p>
            </div>
            <button className="bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
          </div>
        </motion.div>

        {/* Support Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-sm text-gray-400">Total Tickets</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">1</p>
                <p className="text-sm text-gray-400">Open Tickets</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">2h</p>
                <p className="text-sm text-gray-400">Avg Response</p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ticket ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => {
                  const StatusIcon = getStatusIcon(ticket.status);
                  return (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white">{ticket.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ticket.subject}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${
                            ticket.status === 'Resolved' ? 'text-green-400' :
                            ticket.status === 'In Progress' ? 'text-blue-400' :
                            'text-orange-400'
                          }`} />
                          <span className={`text-sm ${
                            ticket.status === 'Resolved' ? 'text-green-400' :
                            ticket.status === 'In Progress' ? 'text-blue-400' :
                            'text-orange-400'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.priority === 'High' ? 'bg-red-900 text-red-300' :
                          ticket.priority === 'Medium' ? 'bg-orange-900 text-orange-300' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{ticket.date}</td>
                      <td className="px-6 py-4">
                        <button className="text-orange-400 hover:text-orange-500 transition-colors text-sm">
                          View Thread
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