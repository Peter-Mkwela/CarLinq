/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  XCircle,
  Car,
  DollarSign,
  LogOut,
  User,
  Trash2,
  Edit,
  ChevronDown,
  Menu,
  X,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Interfaces based on your schema
interface Dealer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  companyName?: string;
  address?: string;
  isVerified: boolean;
  role: 'ADMIN' | 'DEALER';
  createdAt: string;
  updatedAt: string;
  listingsCount?: number;
}

interface Listing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  transmission?: string;
  fuelType?: string;
  status: 'AVAILABLE' | 'SOLD' | 'PENDING' | 'UNAVAILABLE';
  description?: string;
  images: string[];
  viewCount: number;
  likeCount: number;
  inquiryCount: number;
  createdAt: string;
  updatedAt: string;
  dealerId: string;
  dealer?: Dealer;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  listingId: string;
  createdAt: string;
  listing?: {
    make: string;
    model: string;
    year: number;
  };
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface View {
  id: string;
  sessionId: string;
  viewedAt: string;
  ipAddress?: string;
  userAgent?: string;
  listing?: {
    make: string;
    model: string;
  };
}

interface Stats {
  totalUsers: number;
  totalDealers: number;
  totalListings: number;
  activeListings: number;
  soldListings: number;
  totalViews: number;
  totalInquiries: number;
  pendingVerifications: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN' as 'ADMIN' | 'DEALER'
  });

  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  // Fetch all data
  const fetchData = async () => {
  try {
    setLoading(true);
    console.log('🔄 Starting to fetch admin data...');
    
    const apis = [
      { name: 'stats', url: '/api/admin/stats' },
      { name: 'dealers', url: '/api/admin/dealers' },
      { name: 'listings', url: '/api/admin/listings' },
      { name: 'inquiries', url: '/api/admin/inquiries' },
      { name: 'contact-messages', url: '/api/admin/contact-messages' },
      { name: 'views', url: '/api/admin/views' },
    ];

    // Fetch sequentially to see which one fails
    for (const api of apis) {
      console.log(`🔍 Fetching ${api.name} from ${api.url}...`);
      
      try {
        const res = await fetch(api.url, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        
        console.log(`${api.name} status:`, res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`❌ ${api.name} error ${res.status}:`, errorText);
          // Don't throw, just log and continue with other APIs
          continue;
        }
        
        const data = await res.json();
        console.log(`✅ ${api.name} data received`);
        
        switch(api.name) {
          case 'stats':
            setStats(data);
            break;
          case 'dealers':
            setDealers(data.dealers || data);
            break;
          case 'listings':
            setListings(data.listings || data);
            break;
          case 'inquiries':
            setInquiries(data.inquiries || data);
            break;
          case 'contact-messages':
            setContactMessages(data.messages || data);
            break;
          case 'views':
            setViews(data.views || data);
            break;
        }
      } catch (apiError) {
        console.error(`❌ Error fetching ${api.name}:`, apiError);
      }
    }
    
    console.log('✅ All API calls completed');
    
  } catch (error) {
    console.error('❌ Error in fetchData:', error);
    toast.error('Some data failed to load. Check console for details.');
  } finally {
    setLoading(false);
  }
};

  // Replace BOTH useEffects with this single one:

const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
const [initialLoad, setInitialLoad] = useState(true);

useEffect(() => {
  const initializeAdminDashboard = async () => {
    console.log('🔄 Initializing admin dashboard...');
    console.log('Auth status:', authStatus);
    console.log('Session:', session);
    
    // Wait for auth to load
    if (authStatus === 'loading') {
      console.log('⏳ Auth still loading...');
      return;
    }
    
    // Check if unauthenticated
    if (authStatus === 'unauthenticated') {
      console.log('❌ Not authenticated, redirecting to login');
      toast.error('Please sign in to access admin dashboard');
      router.push('/admin/login');
      return;
    }
    
    // Check if authenticated
    if (authStatus === 'authenticated') {
      console.log('✅ Authenticated, checking admin role...');
      console.log('User role:', session?.user?.role);
      
      // Check localStorage first (for custom admin login)
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');
      
      let isUserAdmin = false;
      
      // Check localStorage token
      if (adminToken && adminUser) {
        try {
          const user = JSON.parse(adminUser);
          if (user.role === 'ADMIN') {
            console.log('✅ Admin access via localStorage');
            isUserAdmin = true;
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error parsing admin user:', error);
        }
      }
      
      // Check NextAuth session
      if (!isUserAdmin && session?.user?.role === 'ADMIN') {
        console.log('✅ Admin access via NextAuth session');
        isUserAdmin = true;
        setIsAdmin(true);
      }
      
      // If not admin, redirect
      if (!isUserAdmin) {
        console.log('❌ Not an admin, redirecting to home');
        toast.error('Access denied. Admin privileges required.');
        router.push('/');
        setIsAdmin(false);
        return;
      }
      
      // User is confirmed admin, now fetch data
      console.log('✅ User is admin, fetching dashboard data...');
      try {
        await fetchData();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
      
      setInitialLoad(false);
    }
  };
  
  initializeAdminDashboard();
}, [authStatus, session, router]);

// If not admin (after check)
if (isAdmin === false) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/60">Redirecting...</p>
      </div>
    </div>
  );
}

  // Handle delete listing
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setListings(listings.filter(listing => listing.id !== listingId));
        toast.success('Listing deleted successfully');
      } else {
        throw new Error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  // Handle update listing status
  const handleUpdateListingStatus = async (listingId: string, status: Listing['status']) => {
    try {
      const response = await fetch(`/api/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setListings(listings.map(listing => 
          listing.id === listingId ? { ...listing, status } : listing
        ));
        toast.success('Listing status updated');
      } else {
        throw new Error('Failed to update listing status');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing status');
    }
  };

  // Handle mark inquiry as handled
  const handleMarkInquiryHandled = async (inquiryId: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}/handle`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setInquiries(inquiries.filter(inquiry => inquiry.id !== inquiryId));
        toast.success('Inquiry marked as handled');
      } else {
        throw new Error('Failed to update inquiry');
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error('Failed to update inquiry');
    }
  };

  // Handle add admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });

      if (response.ok) {
        const newAdminData = await response.json();
        setDealers([...dealers, newAdminData]);
        setShowAddAdmin(false);
        setNewAdmin({ name: '', email: '', password: '', role: 'ADMIN' });
        toast.success('Admin user created successfully');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create admin');
    }
  };

  // Filter functions
  const filteredDealers = dealers.filter(dealer =>
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      `${listing.make} ${listing.model} ${listing.location}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      listing.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContactMessages = contactMessages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats data for display
  const statsData = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'orange', change: '+12%' },
    { label: 'Verified Dealers', value: stats.totalDealers, icon: Users, color: 'green', change: '+5%' },
    { label: 'Total Listings', value: stats.totalListings, icon: Car, color: 'orange', change: '+8%' },
    { label: 'Active Listings', value: stats.activeListings, icon: Car, color: 'emerald', change: '+3%' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'orange', change: '+15%' },
    { label: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'orange', change: '+10%' },
    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: AlertCircle, color: 'red', change: 'Need action' },
    { label: 'Total Revenue', value: `$${(stats.revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'orange', change: '+8.5%' },
  ] : [];

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'dealers', label: 'Dealers', icon: Users },
    { id: 'listings', label: 'Listings', icon: Car },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'traffic', label: 'Traffic', icon: Eye },
    { id: 'admins', label: 'Admins', icon: Shield },
  ];

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
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400'
    }
  };

  const handleVerifyDealer = async (dealerId: string, verify: boolean) => {
  try {
    console.log(`Updating dealer ${dealerId} verification to: ${verify}`);
    
    const response = await fetch(`/api/admin/dealers?dealerId=${dealerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified: verify }),
    });

    if (response.ok) {
      // Update local state
      setDealers(dealers.map(dealer => 
        dealer.id === dealerId ? { ...dealer, isVerified: verify } : dealer
      ));
      toast.success(`Dealer ${verify ? 'verified' : 'unverified'} successfully`);
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update dealer');
    }
  } catch (error) {
    console.error('Error updating dealer:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to update dealer');
  }
};

  function handleDeleteUser(id: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/background/carbackground.jpg')" }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>

      {/* Mobile Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-orange-800/50 lg:hidden sticky top-0 z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="text-white/80 hover:text-white p-2 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">
            Admin <span className="text-orange-400">Dashboard</span>
          </h1>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-gray-900/70 backdrop-blur-xl border-b border-orange-800/40 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Admin <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-orange-400">Dashboard</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white/90 font-medium">{session?.user?.name || 'Admin'}</span>
                <span className="text-white/60 text-sm">Super Admin</span>
              </div>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-orange-800/30 transition">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-80 h-full bg-gray-900/80 backdrop-blur-xl border-r border-orange-500/20 pt-20 px-6 overflow-y-auto z-50"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-orange-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Admin Info */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-lg">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{session?.user?.name || 'Admin'}</p>
                  <p className="text-white/60 text-xs truncate">Super Admin</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="mb-6 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 font-medium transition ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-orange-800/60 to-orange-800/40 text-orange-200 border border-orange-700 shadow-inner'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              {stats && (
                <div className="mb-6 pt-4 border-t border-orange-800/30">
                  <h4 className="text-white/60 text-sm font-medium mb-3">Quick Stats</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Users</span>
                      <span className="text-white font-medium">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Active Listings</span>
                      <span className="text-white font-medium">{stats.activeListings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Pending Verifications</span>
                      <span className="text-yellow-400 font-medium">{stats.pendingVerifications}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200 border border-white/10 hover:border-red-500/30 backdrop-blur-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 p-5 shadow-lg sticky top-24">
              <div className="flex items-center gap-3 mb-6 p-3 bg-orange-800/20 rounded-xl">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">{session?.user?.name || 'Admin'}</p>
                  <p className="text-white/60 text-sm truncate">Super Admin</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 font-medium transition ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-orange-800/60 to-orange-800/40 text-orange-200 border border-orange-700 shadow-inner'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </motion.button>
                  );
                })}
              </nav>

              {stats && (
                <div className="mt-8 pt-6 border-t border-orange-800/30">
                  <h4 className="text-white/60 text-sm font-medium mb-3">Platform Stats</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Users</span>
                      <span className="text-white font-medium">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Active Listings</span>
                      <span className="text-white font-medium">{stats.activeListings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Revenue</span>
                      <span className="text-green-400 font-medium">${(stats.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Tabs */}
            <div className="lg:hidden mb-5">
              <div className="flex bg-gray-900/60 backdrop-blur-md rounded-xl p-1 border border-orange-800/30 overflow-x-auto">
                {navigationItems.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex-shrink-0 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg ${
                        activeTab === item.id
                          ? 'bg-orange-700 text-white shadow'
                          : 'text-white/70'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={fetchData}
                  className="flex items-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Welcome Card */}
                  <div className="bg-gradient-to-br from-orange-800/40 to-orange-900/30 backdrop-blur-xl rounded-2xl border border-orange-700/50 p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                      <div>
                        <h2 className="text-2xl font-bold text-white">Welcome, <span className="text-orange-300">{session?.user?.name || 'Admin'}</span>!</h2>
                        <p className="text-orange-100 mt-1">
                          You have {stats?.pendingVerifications || 0} pending dealer verifications and {stats?.totalInquiries || 0} new inquiries to review.
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-orange-700/40 flex items-center justify-center border border-orange-600">
                        <TrendingUp className="w-7 h-7 text-orange-300" />
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsData.map((stat, i) => {
                      const Icon = stat.icon;
                      const colorClass = colorClasses[stat.color as keyof typeof colorClasses];
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-orange-800/40 p-5 hover:border-orange-700/60 transition-all duration-300"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${colorClass.bg} border ${colorClass.text.replace('text-', 'border-')}/30`}>
                              <Icon className={`w-5 h-5 ${colorClass.text}`} />
                            </div>
                            <span className="text-xs text-white/50">{stat.change}</span>
                          </div>
                          <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                          <p className="text-xl font-bold text-white">{stat.value}</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Inquiries */}
                    <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Recent Inquiries</h3>
                      <div className="space-y-3">
                        {inquiries.slice(0, 5).map((inquiry) => (
                          <div key={inquiry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{inquiry.name}</p>
                              <p className="text-white/60 text-sm">{inquiry.email}</p>
                            </div>
                            <button
                              onClick={() => handleMarkInquiryHandled(inquiry.id)}
                              className="px-3 py-1 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                            >
                              Handle
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Listings */}
                    <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Recent Listings</h3>
                      <div className="space-y-3">
                        {listings.slice(0, 5).map((listing) => (
                          <div key={listing.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{listing.make} {listing.model}</p>
                              <p className="text-white/60 text-sm">${listing.price.toLocaleString()} • {listing.status}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                              {listing.viewCount} views
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Dealers Tab */}
              {activeTab === 'dealers' && (
                <motion.div
                  key="dealers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Dealer Management</h2>
                      <p className="text-white/60 mt-1">Manage and verify dealership accounts</p>
                    </div>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-orange-900/20">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Dealer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Listings</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-800/30">
                          {filteredDealers.map((dealer) => (
                            <tr key={dealer.id} className="hover:bg-orange-900/10 transition">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-white font-medium">{dealer.name}</p>
                                  <p className="text-white/60 text-sm">{dealer.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-white">{dealer.companyName || '—'}</p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    dealer.isVerified 
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  }`}>
                                    {dealer.isVerified ? 'Verified' : 'Pending'}
                                  </span>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    dealer.role === 'ADMIN'
                                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  }`}>
                                    {dealer.role}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-white">{dealer.listingsCount || 0}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-white/60 text-sm">
                                  {new Date(dealer.createdAt).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleVerifyDealer(dealer.id, !dealer.isVerified)}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                      dealer.isVerified
                                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30'
                                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                                    }`}
                                  >
                                    {dealer.isVerified ? 'Unverify' : 'Verify'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(dealer.id)}
                                    className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
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

              {/* Listings Tab */}
              {activeTab === 'listings' && (
                <motion.div
                  key="listings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Listings Management</h2>
                      <p className="text-white/60 mt-1">Manage all vehicle listings</p>
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl text-white focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredListings.map((listing) => (
                      <div key={listing.id} className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 p-4 hover:border-orange-700/60 transition-all">
                        <div className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-white font-bold">{listing.make} {listing.model}</h3>
                              <p className="text-white/60 text-sm">{listing.year} • {listing.location}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              listing.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              listing.status === 'SOLD' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {listing.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-white/60 mb-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${listing.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{listing.viewCount} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{listing.inquiryCount} inquiries</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{listing.mileage.toLocaleString()} km</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-white/60 text-sm">
                            Dealer: {listing.dealer?.name || 'Unknown'}
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={listing.status}
                              onChange={(e) => handleUpdateListingStatus(listing.id, e.target.value as Listing['status'])}
                              className="px-2 py-1 text-sm border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg text-white"
                            >
                              <option value="AVAILABLE">Available</option>
                              <option value="PENDING">Pending</option>
                              <option value="SOLD">Sold</option>
                              <option value="UNAVAILABLE">Unavailable</option>
                            </select>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Inquiries Tab */}
              {activeTab === 'inquiries' && (
                <motion.div
                  key="inquiries"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">Contact Inquiries</h2>
                  
                  <div className="space-y-4">
                    {filteredInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-white font-bold">{inquiry.name}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {inquiry.email}
                              </span>
                              {inquiry.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {inquiry.phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(inquiry.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleMarkInquiryHandled(inquiry.id)}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                          >
                            Mark as Handled
                          </button>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-white/80">{inquiry.message}</p>
                        </div>
                        
                        {inquiry.listing && (
                          <div className="p-3 bg-white/5 rounded-lg">
                            <p className="text-white text-sm">
                              Vehicle: {inquiry.listing.make} {inquiry.listing.model} ({inquiry.listing.year})
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">Contact Form Messages</h2>
                  
                  <div className="space-y-4">
                    {filteredContactMessages.map((message) => (
                      <div key={message.id} className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-white font-bold">{message.subject}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {message.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {message.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button className="px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                            Reply
                          </button>
                        </div>
                        
                        <div className="p-4 bg-white/5 rounded-lg">
                          <p className="text-white/80">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Traffic Tab */}
              {activeTab === 'traffic' && (
                <motion.div
                  key="traffic"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">Site Traffic Analytics</h2>
                  
                  <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-orange-900/20">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Session</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Device</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-800/30">
                          {views.slice(0, 20).map((view) => (
                            <tr key={view.id} className="hover:bg-orange-900/10 transition">
                              <td className="px-6 py-4 text-white/60">
                                {new Date(view.viewedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <code className="text-sm text-orange-300">{view.sessionId.slice(0, 8)}...</code>
                              </td>
                              <td className="px-6 py-4 text-white">
                                {view.listing?.make} {view.listing?.model}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-white/60 text-sm">
                                  {view.userAgent?.split(' ')[0] || 'Unknown'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Admins Tab */}
              {activeTab === 'admins' && (
                <motion.div
                  key="admins"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Admin Users</h2>
                      <p className="text-white/60 mt-1">Manage administrator accounts</p>
                    </div>
                    <button 
                      onClick={() => setShowAddAdmin(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Admin
                    </button>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-orange-900/20">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-300 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-800/30">
                          {dealers.filter(d => d.role === 'ADMIN').map((admin) => (
                            <tr key={admin.id} className="hover:bg-orange-900/10 transition">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-white font-medium">{admin.name}</p>
                                  <p className="text-white/60 text-sm">{admin.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                  {admin.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  admin.isVerified 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}>
                                  {admin.isVerified ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 text-orange-400 hover:text-orange-300 transition-colors">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {admin.id !== session?.user?.id && (
                                    <button
                                      onClick={() => handleDeleteUser(admin.id)}
                                      className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
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
            </AnimatePresence>
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
              <h3 className="text-lg font-semibold text-white">Add New Admin</h3>
              <button
                onClick={() => setShowAddAdmin(false)}
                className="text-white/60 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full px-3 py-2 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Admin Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full px-3 py-2 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="admin@carlinq.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full px-3 py-2 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Enter secure password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value as 'ADMIN' | 'DEALER'})}
                  className="w-full px-3 py-2 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl text-white focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="DEALER">Dealer</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  className="px-4 py-2 border border-white/20 text-white/80 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors duration-200"
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