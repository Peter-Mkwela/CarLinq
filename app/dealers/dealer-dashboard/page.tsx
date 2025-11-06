/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Plus, 
  Trash2, 
  Eye, 
  BarChart3, 
  DollarSign,
  Search,
  LogOut,
  User,
  CheckCircle,
  XCircle,
  Camera,
  X,
  TrendingUp,
  MessageCircle,
  Menu
} from 'lucide-react';

// Interfaces
interface Listing {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
  views: number;
  inquiries: number;
  datePosted: string;
  images: string[];
}

interface NewListingForm {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  status: string;
}

// Mock data
const mockListings: Listing[] = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    price: 25000,
    mileage: 15000,
    status: 'available',
    views: 124,
    inquiries: 8,
    datePosted: '2024-01-15',
    images: ['/cars/corolla1.jpg', '/cars/corolla2.jpg']
  },
  {
    id: 2,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2021,
    price: 45000,
    mileage: 22000,
    status: 'available',
    views: 89,
    inquiries: 5,
    datePosted: '2024-01-18',
    images: ['/cars/c-class1.jpg']
  }
];

export default function DealerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newListing, setNewListing] = useState<NewListingForm>({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    status: 'available'
  });
  const [newListingImages, setNewListingImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredListings = listings.filter(listing =>
    `${listing.make} ${listing.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers remain unchanged (delete, status, upload, etc.)
  const handleDeleteListing = (id: number) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter(listing => listing.id !== id));
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setListings(listings.map(listing =>
      listing.id === id ? { ...listing, status: newStatus } : listing
    ));
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(Array.from(e.target.files));
  };
  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setNewListingImages(prev => [...prev, ...imageFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };
  const removeImage = (index: number) => {
    setNewListingImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    const listing: Listing = {
      ...newListing,
      id: listings.length + 1,
      year: parseInt(newListing.year) || 2023,
      price: parseInt(newListing.price) || 0,
      mileage: parseInt(newListing.mileage) || 0,
      views: 0,
      inquiries: 0,
      datePosted: new Date().toISOString().split('T')[0],
      images: imagePreviews
    };
    setListings([...listings, listing]);
    setNewListing({ make: '', model: '', year: '', price: '', mileage: '', status: 'available' });
    setNewListingImages([]);
    setImagePreviews([]);
    setShowAddForm(false);
  };

  const handleInputChange = (field: keyof NewListingForm, value: string) => {
    setNewListing(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      window.location.href = '/dealer/login';
    }
  };

  const stats = {
    totalListings: listings.length,
    availableListings: listings.filter(l => l.status === 'available').length,
    soldListings: listings.filter(l => l.status === 'sold').length,
    totalViews: listings.reduce((sum, l) => sum + l.views, 0),
    totalInquiries: listings.reduce((sum, l) => sum + l.inquiries, 0),
    conversionRate: Math.round((listings.filter(l => l.status === 'sold').length / listings.length) * 100) || 0
  };

  // Close mobile menu on tab change
  useEffect(() => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-x-hidden">
      {/* Background with orange overlay */}
      <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/background/carbackground.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>

      <div className="relative z-10">
        {/* Mobile Header */}
        <header className="bg-gray-900/80 backdrop-blur-xl border-b border-orange-800/50 lg:hidden sticky top-0 z-30">
          <div className="px-4 py-3 flex justify-between items-center">
            <button onClick={() => setMobileMenuOpen(true)} className="text-white/80 hover:text-white p-2">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white">
              Dealer <span className="text-orange-400">Dashboard</span>
            </h1>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block bg-gray-900/70 backdrop-blur-xl border-b border-orange-800/40 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Dealer <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-orange-400">Dashboard</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90 font-medium">Premium Autos</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-orange-800/30 transition">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
              <div className="absolute top-0 left-0 w-64 h-full bg-gray-900/90 backdrop-blur-xl border-r border-orange-800/30 pt-16 px-4">
                <nav className="space-y-2 mt-4">
                  {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'listings', label: 'My Listings', icon: Car },
                  ].map((item) => {
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
                            ? 'bg-orange-800/50 text-orange-300 border border-orange-700'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-medium hover:bg-red-900/30"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 p-5 shadow-lg">
                <nav className="space-y-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'listings', label: 'My Listings', icon: Car },
                  ].map((item) => {
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

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-orange-800/30">
                  <h4 className="text-white/60 text-sm font-medium mb-3">Performance</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Active Listings</span>
                      <span className="text-white font-medium">{stats.availableListings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Views</span>
                      <span className="text-white font-medium">{stats.totalViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Conversion</span>
                      <span className="text-green-400 font-medium">{stats.conversionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {/* Mobile Tab Switcher */}
              <div className="lg:hidden mb-5">
                <div className="flex bg-gray-900/60 backdrop-blur-md rounded-xl p-1 border border-orange-800/30">
                  {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'listings', label: 'Listings', icon: Car },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg ${
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

              {/* Tab Content */}
              <AnimatePresence mode="wait">
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
                          <h2 className="text-2xl font-bold text-white">Welcome back, <span className="text-orange-300">Premium Autos</span>! 🎉</h2>
                          <p className="text-orange-100 mt-1">
                            Your dealership is performing great with{' '}
                            <span className="font-semibold text-green-300">{stats.conversionRate}% conversion rate</span>.
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-orange-700/40 flex items-center justify-center border border-orange-600">
                          <TrendingUp className="w-7 h-7 text-orange-300" />
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Listings', value: stats.totalListings, icon: Car, color: 'orange', change: '+2' },
                        { label: 'Available', value: stats.availableListings, icon: CheckCircle, color: 'green', change: 'Ready' },
                        { label: 'Sold', value: stats.soldListings, icon: XCircle, color: 'red', change: `${stats.conversionRate}%` },
                        { label: 'Views', value: stats.totalViews, icon: Eye, color: 'orange', change: '+124' },
                        { label: 'Inquiries', value: stats.totalInquiries, icon: MessageCircle, color: 'orange', change: '8 new' },
                        { label: 'Revenue', value: `$${(listings.reduce((sum, l) => l.status === 'sold' ? sum + l.price : sum, 0) / 1000).toFixed(0)}K`, icon: DollarSign, color: 'orange', change: 'Month' },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-orange-800/40 p-5 hover:border-orange-700/60 transition-all duration-300"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg bg-${stat.color}-500/20 border border-${stat.color}-500/30`}>
                              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                            </div>
                            <span className="text-xs text-white/50">{stat.change}</span>
                          </div>
                          <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                          <p className="text-xl font-bold text-white">{stat.value}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddForm(true)}
                        className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-orange-800/40 p-5 text-left hover:border-orange-600 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-700/30 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-orange-300" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">Add New Car</h3>
                            <p className="text-white/60 text-sm">List a new vehicle with photos</p>
                          </div>
                        </div>
                      </motion.button>
                      <motion.button
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('listings')}
                        className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-orange-800/40 p-5 text-left hover:border-orange-600 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-700/30 flex items-center justify-center">
                            <Car className="w-6 h-6 text-orange-300" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">Manage Cars</h3>
                            <p className="text-white/60 text-sm">View and edit your listings</p>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'listings' && (
                  <motion.div
                    key="listings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">My Listings</h2>
                        <p className="text-white/70">Manage your vehicle inventory</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Add New Car
                      </motion.button>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/60 backdrop-blur-md border border-orange-800/40 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {/* Listings */}
                    {filteredListings.length === 0 ? (
                      <div className="text-center py-12">
                        <Car className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white/70">No listings found</h3>
                        <p className="text-white/50 mt-2">
                          {searchTerm ? 'Try a different search' : 'Add your first vehicle to get started'}
                        </p>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="mt-4 px-6 py-2.5 bg-orange-600 text-white rounded-xl font-medium"
                        >
                          Add Your First Car
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredListings.map((listing, i) => (
                          <motion.div
                            key={listing.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-orange-800/40 overflow-hidden hover:border-orange-700/60 transition"
                          >
                            <div className="h-36 bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
                              <Car className="w-10 h-10 text-white/30" />
                              <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                                listing.status === 'available'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {listing.status}
                              </span>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-white">{listing.make} {listing.model}</h3>
                                  <p className="text-white/60 text-sm">{listing.year} • {listing.mileage.toLocaleString()} km</p>
                                </div>
                                <p className="text-lg font-bold text-orange-400">${listing.price.toLocaleString()}</p>
                              </div>
                              <div className="flex justify-between text-xs text-white/60 mb-3">
                                <div className="flex items-center gap-1"><Eye className="w-3 h-3" /> {listing.views}</div>
                                <div className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {listing.inquiries}</div>
                              </div>
                              <div className="flex gap-2">
                                <select
                                  value={listing.status}
                                  onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                                  className={`text-xs px-2.5 py-1.5 rounded-lg border backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                                    listing.status === 'available'
                                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                                  }`}
                                >
                                  <option value="available">Available</option>
                                  <option value="sold">Sold</option>
                                  <option value="pending">Pending</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteListing(listing.id)}
                                  className="p-1.5 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Add Listing Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-gray-900/90 backdrop-blur-2xl rounded-2xl border border-orange-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-5 border-b border-orange-800/30">
                <h3 className="text-xl font-semibold text-white">Add New Vehicle</h3>
                <button onClick={() => setShowAddForm(false)} className="text-white/60 hover:text-white p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddListing} className="p-5 space-y-5">
                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['make', 'model', 'year', 'price'] as const).map(field => (
                    <div key={field}>
                      <label className="block text-white/80 text-sm mb-2 capitalize">{field} *</label>
                      <input
                        type={field === 'year' || field === 'price' ? 'number' : 'text'}
                        required
                        value={newListing[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/70 border border-orange-800/40 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder={field === 'make' ? 'Toyota' : field === 'model' ? 'Corolla' : field === 'year' ? '2022' : '25000'}
                        min={field === 'year' ? '1990' : field === 'price' ? '0' : undefined}
                        max={field === 'year' ? '2025' : undefined}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-white/80 text-sm mb-2">Mileage (km) *</label>
                    <input
                      type="number"
                      required
                      value={newListing.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/70 border border-orange-800/40 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="15000"
                      min="0"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-white/80 text-sm mb-3">Vehicle Photos *</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                      isDragging ? 'border-orange-500 bg-orange-500/10' : 'border-orange-800/50 hover:border-orange-500'
                    }`}
                  >
                    <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
                    <Camera className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-orange-400' : 'text-white/40'}`} />
                    <p className="text-white font-medium mb-1">{isDragging ? 'Drop photos here' : 'Drag & drop photos'}</p>
                    <p className="text-white/60 text-sm">or click to browse files</p>
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-white/80 text-sm mb-2">Uploaded ({imagePreviews.length})</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {imagePreviews.map((src, i) => (
                          <div key={i} className="relative group">
                            <img src={src} alt="" className="w-full h-16 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-orange-800/30">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 text-white/80 hover:text-white rounded-xl border border-orange-800/50 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={imagePreviews.length === 0}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-medium disabled:opacity-50 shadow-lg shadow-orange-500/20"
                  >
                    Create Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}