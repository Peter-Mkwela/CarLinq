/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  MessageSquare, 
  UserPlus,
  BarChart3,
  Shield,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Mock data
const mockClients = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    type: 'Dealer',
    status: 'Active',
    joinDate: '2024-01-15',
    listings: 12,
    location: 'New York, NY'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarahj@dealership.com',
    phone: '+1 (555) 987-6543',
    type: 'Dealer',
    status: 'Active',
    joinDate: '2024-01-20',
    listings: 8,
    location: 'Los Angeles, CA'
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@email.com',
    phone: '+1 (555) 456-7890',
    type: 'Buyer',
    status: 'Active',
    joinDate: '2024-02-01',
    listings: 0,
    location: 'Chicago, IL'
  }
];

const mockTraffic = [
  {
    id: 1,
    ip: '192.168.1.100',
    country: 'United States',
    city: 'New York',
    page: '/cars',
    duration: '2m 34s',
    timestamp: '2024-01-20 14:30:22',
    device: 'Desktop'
  },
  {
    id: 2,
    ip: '192.168.1.101',
    country: 'Canada',
    city: 'Toronto',
    page: '/dealers',
    duration: '1m 15s',
    timestamp: '2024-01-20 14:25:10',
    device: 'Mobile'
  },
  {
    id: 3,
    ip: '192.168.1.102',
    country: 'United Kingdom',
    city: 'London',
    page: '/about',
    duration: '45s',
    timestamp: '2024-01-20 14:20:05',
    device: 'Tablet'
  }
];

const mockMessages = [
  {
    id: 1,
    name: 'Robert Brown',
    email: 'robert.brown@email.com',
    phone: '+1 (555) 111-2222',
    subject: 'Car Inquiry - Toyota Corolla',
    message: 'I am interested in the 2022 Toyota Corolla. Can you provide more details about the vehicle history?',
    status: 'New',
    date: '2024-01-20 14:30:00'
  },
  {
    id: 2,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 333-4444',
    subject: 'Partnership Opportunity',
    message: 'We represent a large dealership network and would like to discuss partnership opportunities with CarLinq.',
    status: 'Replied',
    date: '2024-01-19 11:15:00'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 555-6666',
    subject: 'Technical Support',
    message: 'Having issues uploading vehicle photos. The upload progress gets stuck at 80%.',
    status: 'Resolved',
    date: '2024-01-18 09:45:00'
  }
];

const mockAdmins = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@carlinq.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: '2024-01-20 14:25:00'
  },
  {
    id: 2,
    name: 'Support Admin',
    email: 'support@carlinq.com',
    role: 'Support',
    status: 'Active',
    lastLogin: '2024-01-19 16:30:00'
  }
];

const stats = {
  totalUsers: 1247,
  activeDealers: 89,
  totalMessages: 342,
  siteVisits: 8456,
  growthRate: 12.5,
  conversionRate: 8.2
};

// Color mapping for consistent styling
const colorClasses = {
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400'
  },
 
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400'
  }
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'Support',
    password: ''
  });

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add admin logic here
    console.log('Adding new admin:', newAdmin);
    setShowAddAdmin(false);
    setNewAdmin({ name: '', email: '', role: 'Support', password: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setNewAdmin(prev => ({ ...prev, [field]: value }));
  };

  const statsData = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'orange', change: '+12%' },
    { label: 'Active Dealers', value: stats.activeDealers, icon: Users, color: 'green', change: '+5%' },
    { label: 'Site Visits', value: stats.siteVisits, icon: Eye, color: 'orange', change: '+8%' },
    { label: 'Total Messages', value: stats.totalMessages, icon: MessageSquare, color: 'orange', change: '+15%' },
    { label: 'Growth Rate', value: `${stats.growthRate}%`, icon: TrendingUp, color: 'emerald', change: '+2.1%' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: CheckCircle, color: 'orange', change: '+0.8%' },
  ];

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'traffic', label: 'Site Traffic', icon: Eye },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'admins', label: 'Admin Users', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-x-hidden">
      {/* Background with orange overlay */}
      <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/background/carbackground.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>
      
      {/* Header */}
      <header className="relative bg-gray-900/70 backdrop-blur-xl border-b border-orange-700/40 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-white"
              >
                Admin <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">Dashboard</span>
              </motion.h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white/90">
                  Super Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-700/30 p-6 shadow-lg"
            >
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-orange-700/60 to-orange-500/40 text-orange-300 border border-orange-600'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statsData.map((stat, index) => {
                    const Icon = stat.icon;
                    const colorClass = colorClasses[stat.color as keyof typeof colorClasses];
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-700/30 p-6 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white/60">
                              {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-white mt-1">
                              {stat.value}
                            </p>
                            <p className="text-xs text-green-400 mt-1">
                              {stat.change}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${colorClass.bg}`}>
                            <Icon className={`w-6 h-6 ${colorClass.text}`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-700/30 p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {mockTraffic.slice(0, 3).map((visit) => (
                        <div key={visit.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            <span className="text-white/60">{visit.city}, {visit.country}</span>
                          </div>
                          <span className="text-white/40">{visit.page}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-700/30 p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Recent Messages
                    </h3>
                    <div className="space-y-3">
                      {mockMessages.slice(0, 3).map((message) => (
                        <div key={message.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-orange-400" />
                            <span className="text-white/60 truncate">{message.name}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            message.status === 'New' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            message.status === 'Replied' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {message.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Client Management
                    </h2>
                    <p className="text-white/60 mt-1">
                      Manage dealers and buyers
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-orange-700/40 rounded-lg bg-gray-800/60 text-white placeholder-white/40 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-orange-700/40 rounded-lg bg-gray-800/60 text-white/80 hover:text-white hover:bg-orange-900/30 transition">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-700/30 overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-orange-900/20">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Listings</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Join Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-800/30">
                        {mockClients.map((client) => (
                          <tr key={client.id} className="hover:bg-orange-900/10 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{client.name}</div>
                                <div className="text-sm text-white/60">{client.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                client.type === 'Dealer' 
                                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
                              }`}>
                                {client.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                client.status === 'Active' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {client.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {client.listings}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                              {client.joinDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-orange-400 hover:text-orange-300 transition">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Traffic Tab */}
            {activeTab === 'traffic' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Site Traffic Analytics
                    </h2>
                    <p className="text-white/60 mt-1">
                      Real-time visitor tracking and analytics
                    </p>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-orange-700/40 rounded-lg bg-gray-800/60 text-white/80 hover:text-white hover:bg-orange-900/30 transition">
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </button>
                </div>

                <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-700/30 overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-orange-900/20">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">IP Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Page Visited</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Device</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-800/30">
                        {mockTraffic.map((visit) => (
                          <tr key={visit.id} className="hover:bg-orange-900/10 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                              {visit.ip}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {visit.city}, {visit.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                              {visit.page}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {visit.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                              {visit.device}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                              {visit.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Contact Form Messages
                    </h2>
                    <p className="text-white/60 mt-1">
                      Manage customer inquiries and support requests
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <select className="px-4 py-2 border border-orange-700/40 rounded-lg bg-gray-800/60 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="">All Status</option>
                      <option value="new">New</option>
                      <option value="replied">Replied</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div key={message.id} className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-700/30 p-6 shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {message.subject}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-white/60">
                            <span className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{message.email}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{message.phone}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{message.date}</span>
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          message.status === 'New' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          message.status === 'Replied' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {message.status}
                        </span>
                      </div>
                      <p className="text-white/60 mb-4">
                        {message.message}
                      </p>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-lg transition-colors duration-200 shadow-lg shadow-orange-500/20">
                          Reply
                        </button>
                        <button className="px-4 py-2 border border-orange-700/40 text-white/80 rounded-lg hover:bg-orange-900/30 hover:text-white transition-colors duration-200">
                          Mark as Resolved
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Admins Tab */}
            {activeTab === 'admins' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Admin Users
                    </h2>
                    <p className="text-white/60 mt-1">
                      Manage administrator accounts and permissions
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowAddAdmin(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-lg transition-colors duration-200 shadow-lg shadow-orange-500/20"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Admin</span>
                  </button>
                </div>

                <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-700/30 overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-orange-900/20">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Admin</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Last Login</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-800/30">
                        {mockAdmins.map((admin) => (
                          <tr key={admin.id} className="hover:bg-orange-900/10 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{admin.name}</div>
                                <div className="text-sm text-white/60">{admin.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                admin.role === 'Super Admin' 
                                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              }`}>
                                {admin.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                admin.status === 'Active' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {admin.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                              {admin.lastLogin}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-orange-400 hover:text-orange-300 transition">
                                  Edit
                                </button>
                                <button className="text-red-400 hover:text-red-300 transition">
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/90 backdrop-blur-2xl rounded-2xl border border-orange-700/50 w-full max-w-md p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">
                Add New Admin
              </h3>
              <button
                onClick={() => setShowAddAdmin(false)}
                className="text-white/60 hover:text-white transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newAdmin.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-700/40 rounded-lg bg-gray-800/60 text-white placeholder-white/40 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Admin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-700/40 rounded-lg bg-gray-800/60 text-white placeholder-white/40 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="admin@carlinq.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-700/40 rounded-lg bg-gray-800/60 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Support">Support Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newAdmin.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-orange-700/40 rounded-lg bg-gray-800/60 text-white placeholder-white/40 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter secure password"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  className="px-4 py-2 border border-orange-700/40 rounded-lg text-white/80 hover:text-white hover:bg-orange-900/30 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-lg transition-colors duration-200 shadow-lg shadow-orange-500/20"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}