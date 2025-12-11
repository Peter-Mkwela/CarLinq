/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
export const dynamic = 'force-dynamic';;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
  TrendingUp,
  MessageCircle,
  Menu,
  Fuel,
  Settings,
  Gauge,
  MapPin,
  Share2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import AddListingModal, { Listing } from '@/components/AddListingModal';
import CompleteProfileModal from '@/components/CompleteProfileModal';

// Interfaces
interface NewListingForm {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  location: string;
  status: string;
   viewCount: number;      // âœ… Add this
  inquiryCount: number;   // âœ… Add this
  likeCount?: number;     // âœ… Optional: Add if you want to show likes too
}

// Image Gallery Modal Component (for dealer dashboard)
function ImageGalleryModal({ 
  images, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: { 
  images: string[]; 
  isOpen: boolean; 
  onClose: () => void; 
  initialIndex?: number; 
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, initialIndex]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl h-[90vh] bg-black/90 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={images[currentIndex]}
                  alt={`Car image ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain p-4"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 p-4 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        index === currentIndex
                          ? 'border-orange-500 scale-105'
                          : 'border-transparent hover:border-white/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function DealerDashboard() {
  const [selectedCarImages, setSelectedCarImages] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();
  
  // NextAuth session
  const { data: session, status: authStatus } = useSession();

  // Debug mobile menu state
  useEffect(() => {
    console.log('ðŸ”„ mobileMenuOpen state:', mobileMenuOpen);
  }, [mobileMenuOpen]);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/dealers/listings', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setListings(data.listings);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast.error('Failed to load listings');
      }
    };

    if (session) {
      fetchListings();
    }
  }, [session]);

  // Check profile completeness
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) return;
        const userData = await response.json();
        if (!userData.companyName || !userData.phone) {
          setShowProfileModal(true);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    if (session?.user) {
      checkProfile();
    }
  }, [session]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      toast.error('Please sign in to access the dashboard');
      router.push('/dealers/login');
    }
  }, [authStatus, router]);
  
  if (!session) return null;

  // Apply filters
  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      `${listing.make} ${listing.model} ${listing.location}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      listing.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Open image gallery
  const openImageGallery = (images: string[], index: number = 0) => {
    setSelectedCarImages(images);
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      console.log('Updating status for listing:', id, 'to:', newStatus);
      
      const statusMap: { [key: string]: string } = {
        'available': 'AVAILABLE',
        'pending': 'PENDING', 
        'sold': 'SOLD'
      };
      
      const apiStatus = statusMap[newStatus.toLowerCase()];
      
      if (!apiStatus) {
        throw new Error('Invalid status value');
      }

      // Optimistic update
      setListings(prev =>
        prev.map(listing =>
          listing.id === id ? { ...listing, status: newStatus.toLowerCase() } : listing
        )
      );

      // API call
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: apiStatus 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `Failed to update status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Status update successful:', result);
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      
      // Revert optimistic update on error
      const refreshResponse = await fetch('/api/dealers/listings');
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const normalizedListings = data.listings.map((listing: any) => ({
          ...listing,
          status: listing.status.toLowerCase()
        }));
        setListings(normalizedListings);
      }
    }
  };

  const handleDeleteListing = async (id: string) => {
    const accepted = await confirmDelete("Are you sure you want to delete this listing? This action cannot be undone.");
    if (!accepted) return;

    try {
      const response = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete listing");
      }
      setListings(listings.filter((listing) => listing.id !== id));
      toast.success("Listing deleted successfully!");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete listing");
    }
  };

  const handleProfileComplete = async (data: { companyName: string; phone: string }) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setShowProfileModal(false);
        toast.success('Profile updated successfully!');
        window.location.reload();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const confirmDelete = (message: string) => {
    return new Promise<boolean>((resolve) => {
      const id = toast.custom((t) => (
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white shadow-xl w-[90%] md:w-[380px] animate-in fade-in zoom-in duration-300">
          <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
          <p className="text-white/80 text-sm mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(false);
              }}
              className="px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(true);
              }}
              className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-semibold shadow-md transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      ));
    });
  };

  const handleAddListing = (newListing: any) => {
    setListings(prev => [newListing, ...prev]);
    setShowAddForm(false);
  };

  const handleLogout = () => {
    toast.custom(
      (t) => (
        <div className={`bg-white border border-gray-200 shadow-md rounded-lg p-4 w-64 sm:w-72 md:w-64 ${t.visible ? 'animate-enter' : 'animate-leave'} max-sm:fixed max-sm:top-5 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:z-50`}>
          <p className="text-sm sm:text-base text-gray-800 mb-3">Are you sure you want to log out?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                signOut({ callbackUrl: '/dealers/login' });
                toast.success('Logged out successfully.', { position: 'top-right' });
              }}
              className="px-3 py-1.5 text-sm sm:text-base bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-sm sm:text-base bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { position: 'top-right', duration: 4000, style: { margin: '1rem' } }
    );
  };

 const stats = {
  totalListings: listings.length,
  availableListings: listings.filter(l => l.status.toLowerCase() === 'available').length,
  soldListings: listings.filter(l => l.status.toLowerCase() === 'sold').length,
  totalViews: listings.reduce((sum, l) => sum + (l.viewCount || 0), 0), // âœ… Use viewCount
  totalInquiries: listings.reduce((sum, l) => sum + (l.inquiryCount || 0), 0), // âœ… Use inquiryCount
  conversionRate: Math.round((listings.filter(l => l.status.toLowerCase() === 'sold').length / (listings.length || 1)) * 100) || 0
};

  const userName = session.user?.name || 'Dealer';
  const userEmail = session.user?.email || '';

  // Custom Dropdown Component
  const CustomDropdown = ({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 appearance-none cursor-pointer pr-8"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-gray-900">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-x-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/background/carbackground.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>

      <div className="relative z-10">
        {/* Mobile Header - FIXED VERSION */}
        <header className="bg-gray-900/80 backdrop-blur-xl border-b border-orange-800/50 lg:hidden sticky top-0 z-50">
          <div className="px-4 py-3 flex justify-between items-center">
            <button 
              onClick={() => {
                console.log('ðŸŽ¯ Hamburger button clicked - setting mobileMenuOpen to TRUE');
                setMobileMenuOpen(true);
              }} 
              className="text-white/80 hover:text-white p-2 transition-colors z-60"
            >
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
                <div className="flex items-center gap-2">
                  <span className="text-white/90 font-medium">{userName}</span>
                  <span className="text-white/40"></span>
                  <span className="text-white/60 text-sm">{userEmail}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-orange-800/30 transition">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu - FIXED with HIGHER z-index */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 w-80 h-full bg-gray-900/80 backdrop-blur-xl border-r border-orange-500/20 pt-20 px-6 overflow-y-auto z-50"
              >
                {/* Close Button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-orange-300 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>

                {/* User Info - Full Name & Email */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-lg">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{session?.user?.name || 'Dealer User'}</p>
                    <p className="text-white/60 text-xs truncate">{session?.user?.email || 'user@example.com'}</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200 border border-white/10 hover:border-red-500/30 backdrop-blur-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-orange-800/30 p-5 shadow-lg">
                <div className="flex items-center gap-3 mb-6 p-3 bg-orange-800/20 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium truncate">{userName}</p>
                    <p className="text-white/60 text-sm truncate">{userEmail}</p>
                  </div>
                </div>
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

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-orange-800/40 to-orange-900/30 backdrop-blur-xl rounded-2xl border border-orange-700/50 p-6 shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div>
                          <h2 className="text-2xl font-bold text-white">Welcome back, <span className="text-orange-300">{userName}</span>! </h2>
                          <p className="text-orange-100 mt-1">
                            {listings.length === 0 
                              ? 'Start by adding your first vehicle listing to get started.' 
                              : `Your dealership has ${stats.totalListings} active listings with ${stats.conversionRate}% conversion rate.`
                            }
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-orange-700/40 flex items-center justify-center border border-orange-600">
                          <TrendingUp className="w-7 h-7 text-orange-300" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddForm(true)}
                        className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-orange-800/40 p-5 text-left hover:border-orange-600 transition group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-700/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
                        className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-orange-800/40 p-5 text-left hover:border-orange-600 transition group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-700/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <Car className="w-6 h-6 text-orange-300" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">Manage Cars</h3>
                            <p className="text-white/60 text-sm">View and edit your listings</p>
                          </div>
                        </div>
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Listings', value: stats.totalListings, icon: Car, color: 'orange', change: listings.length === 0 ? 'Start' : '+0' },
                        { label: 'Available', value: stats.availableListings, icon: CheckCircle, color: 'green', change: 'Ready' },
                        { label: 'Sold', value: stats.soldListings, icon: XCircle, color: 'red', change: `${stats.conversionRate}%` },
                        { label: 'Views', value: stats.totalViews, icon: Eye, color: 'orange', change: '+0' },
                        { label: 'Inquiries', value: stats.totalInquiries, icon: MessageCircle, color: 'orange', change: '0 new' },
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
                    <section className="relative">
                      <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                          Manage Your Inventory
                        </h1>
                        <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto drop-shadow">
                          Track and manage all your vehicle listings in one place
                        </p>
                      </div>
                    </section>

                    <section className="sticky top-0 z-40">
                      <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                          {/* Search Input */}
                          <div className="flex-1 w-full sm:max-w-2xl">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                              <input
                                type="text"
                                placeholder="Search by make, model, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-base border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                              />
                            </div>
                          </div>

                          {/* Filters and Add Button */}
                          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full sm:w-auto">
                            {/* Status Dropdown */}
                            <div className="w-full sm:w-48">
                              <CustomDropdown
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                  { value: 'all', label: 'All Status' },
                                  { value: 'available', label: 'Available' },
                                  { value: 'pending', label: 'Pending' },
                                  { value: 'sold', label: 'Sold' }
                                ]}
                              />
                            </div>

                            {/* Add Car Button - Beautifully Styled */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowAddForm(true)}
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 font-semibold text-base w-full sm:w-auto"
                            >
                              <Plus className="w-5 h-5" />
                              <span>Add Car</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 shadow-xl overflow-hidden"
                      >
                        <div className="p-4 sm:p-6 border-b border-white/20">
                          <div className="flex justify-between items-center">
                            <p className="text-white/90 text-base sm:text-lg font-medium drop-shadow">
                              Showing {filteredListings.length} of {listings.length} vehicles
                            </p>
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                              <Eye className="w-4 h-4" />
                              <span>{stats.totalViews} total views</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 sm:p-6">
                          {filteredListings.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                              <Car className="w-12 h-12 sm:w-16 sm:h-16 text-white/60 mx-auto mb-3 sm:mb-4" />
                              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 drop-shadow">
                                No listings found
                              </h3>
                              <p className="text-white/80 mb-4 drop-shadow text-sm sm:text-base">
                                {searchTerm ? 'Try adjusting your search terms' : 'Add your first vehicle to get started'}
                              </p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm text-sm sm:text-base font-medium"
                              >
                                Add Your First Car
                              </motion.button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                              {filteredListings.map((listing, index) => (
                                <motion.div
                                  key={listing.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 overflow-hidden group"
                                >
                                  {/* Car Image with Gallery Feature */}
                                  <div className="relative h-36 sm:h-48 bg-gray-200 overflow-hidden cursor-pointer">
                                    {listing.images && listing.images.length > 0 ? (
                                      <>
                                        <img 
                                          src={listing.images[0]} 
                                          alt={`${listing.make} ${listing.model}`}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          onClick={() => openImageGallery(listing.images, 0)}
                                        />
                                        {listing.images.length > 1 && (
                                          <div 
                                            className="absolute bottom-2 right-2 flex items-center gap-1 cursor-pointer"
                                            onClick={() => openImageGallery(listing.images, 0)}
                                          >
                                            <div className="flex">
                                              {listing.images.slice(0, 3).map((_, idx) => (
                                                <div 
                                                  key={idx}
                                                  className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                                    idx === 0 ? 'bg-white' : 'bg-white/60'
                                                  }`}
                                                />
                                              ))}
                                            </div>
                                            <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                                              +{listing.images.length - 1}
                                            </span>
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div 
                                        className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center cursor-pointer"
                                        onClick={() => openImageGallery(listing.images, 0)}
                                      >
                                        <Car className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
                                      </div>
                                    )}
                                    
                                    {/* Status Badge */}
                                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                                      <span className={`text-xs font-bold px-2 py-1 rounded backdrop-blur-sm ${
                                        listing.status.toLowerCase() === 'available'
                                          ? 'bg-emerald-500 text-white'
                                          : listing.status.toLowerCase() === 'sold'
                                          ? 'bg-red-500 text-white'
                                          : 'bg-amber-400 text-gray-900'
                                      }`}>
                                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                      </span>
                                    </div>

                                    {/* Delete Button */}
                                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteListing(listing.id);
                                        }}
                                        className="p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 transition-colors duration-200"
                                      >
                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </button>
                                    </div>

                                    {/* Views & Inquiries Counter */}
<div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
  <div className="flex gap-2 text-xs text-white backdrop-blur-sm bg-black/30 rounded-full px-2 py-1">
    <span className="flex items-center gap-1">
      <Eye className="w-3 h-3" />
      {listing.viewCount || 0} {/* âœ… Use viewCount */}
    </span>
    <span className="flex items-center gap-1">
      <MessageCircle className="w-3 h-3" />
      {listing.inquiryCount || 0} {/* âœ… Use inquiryCount */}
    </span>
  </div>
</div>
                                  </div>

                                  {/* Car Details */}
                                  <div className="p-3 sm:p-4">
                                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                          {listing.make} {listing.model}
                                        </h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                          {listing.year}  {listing.location}
                                        </p>
                                      </div>
                                      <div className="text-right ml-2">
                                        <p className="font-bold text-orange-600 text-sm sm:text-base whitespace-nowrap">
                                          ${listing.price.toLocaleString()}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Gauge className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="truncate">{listing.mileage?.toLocaleString() || 'â€”'} km</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Fuel className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="truncate">{listing.fuelType || 'Petrol'}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="truncate">{listing.transmission || 'Automatic'}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{listing.year}</span>
                                      </div>
                                    </div>

                                    {/* Status Dropdown */}
                                    <div className="mt-2">
                                      <CustomDropdown
                                        value={listing.status}
                                        onChange={(newStatus) => handleStatusChange(listing.id, newStatus)}
                                        options={[
                                          { value: 'available', label: 'Available' },
                                          { value: 'pending', label: 'Pending' },
                                          { value: 'sold', label: 'Sold' }
                                        ]}
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {showAddForm && (
            <AddListingModal 
              isOpen={showAddForm}
              onClose={() => setShowAddForm(false)}
              onAddListing={handleAddListing}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showProfileModal && (
            <CompleteProfileModal 
              isOpen={showProfileModal}
              userEmail={session?.user?.email || ''}
              onComplete={handleProfileComplete}
            />
          )}
        </AnimatePresence>

        {/* Image Gallery Modal */}
        <ImageGalleryModal
          images={selectedCarImages}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          initialIndex={selectedImageIndex}
        />
      </div>
    </div>
  );
}
