/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Car, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  MapPin, 
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Building,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Add this function right after your imports, before the component definition
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('car_session_id');
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('car_session_id', sessionId);
  }
  
  return sessionId;
}

interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  location: string;
  images: string[];
  dealer: {
    companyName: string;
    phone: string;
    name: string;
  };
  status: string;
  datePosted: string;
  views: number;
  inquiries: number;
}

// Image Gallery Modal Component
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

export default function BrowseCars() {
  const [selectedCarImages, setSelectedCarImages] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cars, setCars] = useState<CarListing[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    minMileage: '',
    maxMileage: '',
    transmission: '',
    fuelType: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    makes: [] as string[],
    models: [] as string[],
    locations: [] as string[],
    transmissions: [] as string[],
    fuelTypes: [] as string[],
    years: [] as number[]
  });

  const { data: session } = useSession();
  const router = useRouter();

  // Fetch car listings, filter options, and user favorites
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch car listings
        const listingsResponse = await fetch('/api/car-listings');
        if (!listingsResponse.ok) throw new Error('Failed to fetch listings');
        const listingsData = await listingsResponse.json();
        
        // 2. Fetch filter options
        const filtersResponse = await fetch('/api/car-filters');
        if (!filtersResponse.ok) throw new Error('Failed to fetch filters');
        const filtersData = await filtersResponse.json();
        
        setCars(listingsData.listings);
        setFilteredCars(listingsData.listings);
        setFilterOptions(filtersData.filterOptions);
        
        // 3. Get session ID
        const sessionId = getOrCreateSessionId();
        
        // 4. Load favorites from database (for this session)
        const favoritesResponse = await fetch(`/api/favorites/all?sessionId=${sessionId}`);
        if (favoritesResponse.ok) {
          const dbFavorites = await favoritesResponse.json();
          // dbFavorites is an array of { listingId: string } objects
          const dbFavoriteIds = dbFavorites.map((fav: any) => fav.listingId);
          setFavorites(dbFavoriteIds);
          
          // Also save to localStorage for offline use
          localStorage.setItem('clientFavorites', JSON.stringify(dbFavoriteIds));
        } else {
          // Fallback to localStorage if DB fails
          const storedFavorites = localStorage.getItem('clientFavorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // On error, use localStorage as fallback
        const storedFavorites = localStorage.getItem('clientFavorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Apply filters
  useEffect(() => {
    let results = cars;

    // Search term filter
    if (searchTerm) {
      results = results.filter(car => 
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.dealer.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Advanced filters
    if (filters.make) {
      results = results.filter(car => car.make === filters.make);
    }
    if (filters.model) {
      results = results.filter(car => car.model === filters.model);
    }
    if (filters.minYear) {
      results = results.filter(car => car.year >= parseInt(filters.minYear));
    }
    if (filters.maxYear) {
      results = results.filter(car => car.year <= parseInt(filters.maxYear));
    }
    if (filters.minPrice) {
      results = results.filter(car => car.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(car => car.price <= parseInt(filters.maxPrice));
    }
    if (filters.minMileage) {
      results = results.filter(car => car.mileage >= parseInt(filters.minMileage));
    }
    if (filters.maxMileage) {
      results = results.filter(car => car.mileage <= parseInt(filters.maxMileage));
    }
    if (filters.transmission) {
      results = results.filter(car => car.transmission === filters.transmission);
    }
    if (filters.fuelType) {
      results = results.filter(car => car.fuelType === filters.fuelType);
    }
    if (filters.location) {
      results = results.filter(car => car.location === filters.location);
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'year-new':
        results.sort((a, b) => b.year - a.year);
        break;
      case 'mileage-low':
        results.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'featured':
        results.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    setFilteredCars(results);
  }, [searchTerm, filters, sortBy, cars]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const openImageGallery = (images: string[], index: number = 0) => {
    setSelectedCarImages(images);
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
      transmission: '',
      fuelType: '',
      location: ''
    });
    setSearchTerm('');
  };

  // Toggle favorite - UPDATED VERSION (Hybrid: localStorage + database)
  const toggleFavorite = async (carId: string) => {
    try {
      // Get session ID
      const sessionId = getOrCreateSessionId();
      
      // Get current favorites from localStorage for instant UI feedback
      const storedFavorites = localStorage.getItem('clientFavorites');
      let currentFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      const isCurrentlyFavorite = currentFavorites.includes(carId);
      
      // Instant UI update
      if (isCurrentlyFavorite) {
        currentFavorites = currentFavorites.filter((id: string) => id !== carId);
        toast.success('Removed from favorites');
      } else {
        currentFavorites.push(carId);
        toast.success('Added to favorites');
      }
      
      // Update state and localStorage
      setFavorites(currentFavorites);
      localStorage.setItem('clientFavorites', JSON.stringify(currentFavorites));
      
      // Sync with database
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          listingId: carId, 
          sessionId: sessionId,
          action: isCurrentlyFavorite ? 'remove' : 'add'
        }),
      });

      if (!response.ok) {
        console.error('Failed to sync with database');
      }
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  // Add this function near your other functions
  const trackInquiry = async (carId: string) => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await fetch(`/api/listings/${carId}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId,
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to track inquiry');
      }
    } catch (error) {
      console.error('Error tracking inquiry:', error);
    }
  };

  // Enhanced WhatsApp sharing with image and browser link
  const shareCarToWhatsApp = (car: CarListing) => {
    // Get the car image URL (use first image or placeholder)
    const carImageUrl = car.images && car.images.length > 0 
      ? car.images[0] 
      : 'https://via.placeholder.com/600x400/1e3a8a/ffffff?text=Car+Image'; // Placeholder URL
    
    // Use main cars page URL
    const mainCarsUrl = `${window.location.origin}/cars`;
    
    // Create a rich message with image and link (like premium sites)
    const message = `*${car.make} ${car.model} (${car.year})*\n\n` +
      `*Price:* $${car.price.toLocaleString()}\n` +
      `*Mileage:* ${car.mileage.toLocaleString()} km\n` +
      `*Transmission:* ${car.transmission}\n` +
      `*Fuel Type:* ${car.fuelType}\n` +
      `*Location:* ${car.location}\n\n` +
      `*Dealer:* ${car.dealer.companyName}\n\n` +
      `*Car Image:* ${carImageUrl}\n` +
      `*View All Listings:* ${mainCarsUrl}\n\n` +
      `_Check out this amazing vehicle!_\n` +
      `_Shared via Carlinq.com`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Enhanced contact dealer with car details, image, and link
  const contactDealerWhatsApp = (car: CarListing) => {
    if (!car.dealer.phone || car.dealer.phone === 'Not provided') {
      toast.error('Dealer phone number not available');
      return;
    }
    
    const cleanedPhone = car.dealer.phone.replace(/\D/g, '');
    let whatsappNumber = cleanedPhone;
    
    if (cleanedPhone.startsWith('0') && cleanedPhone.length === 10) {
      whatsappNumber = '263' + cleanedPhone.slice(1);
    } else if (cleanedPhone.length === 9) {
      whatsappNumber = '263' + cleanedPhone;
    } else if (cleanedPhone.startsWith('263') && cleanedPhone.length === 12) {
      whatsappNumber = cleanedPhone;
    } else if (cleanedPhone.startsWith('+263') && cleanedPhone.length === 13) {
      whatsappNumber = cleanedPhone.slice(1);
    }
    
    // Get car image URL
    const carImageUrl = car.images && car.images.length > 0 
      ? car.images[0] 
      : 'https://via.placeholder.com/600x400/1e3a8a/ffffff?text=Car+Image';
    
    // Get browser link - Use main cars page instead of specific car page
    const browserLink = `${window.location.origin}/cars`;
    
    // Create a professional inquiry message with all details
    const message = `Hello ${car.dealer.name || car.dealer.companyName},\n\n` +
      `I am interested in your *${car.make} ${car.model} (${car.year})* listed for *$${car.price.toLocaleString()}*.\n\n` +
      `*Vehicle Details:*\n` +
      `• Make & Model: ${car.make} ${car.model}\n` +
      `• Year: ${car.year}\n` +
      `• Price: $${car.price.toLocaleString()}\n` +
      `• Mileage: ${car.mileage.toLocaleString()} km\n` +
      `• Transmission: ${car.transmission}\n` +
      `• Fuel Type: ${car.fuelType}\n` +
      `• Location: ${car.location}\n\n` +
      `*Car Image:* ${carImageUrl}\n` +
      `*View All Listings:* ${browserLink}\n\n`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone === 'Not provided') return 'Not provided';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('263') && cleaned.length === 12) {
      return '0' + cleaned.slice(3);
    } else if (cleaned.length === 9) {
      return '0' + cleaned;
    } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
      return cleaned;
    } else if (cleaned.length === 12 && cleaned.startsWith('263')) {
      return '0' + cleaned.slice(3);
    }
    
    return phone;
  };

  // Optional: Generate QR code for sharing (Premium Feature)
  const generateShareQR = (car: CarListing) => {
    const browserLink = `${window.location.origin}/cars/${car.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(browserLink)}`;
    return qrCodeUrl;
  };

  const trackView = async (carId: string) => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await fetch(`/api/listings/${carId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId,
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to track view');
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hero Background */}
      <div className="flex-1 flex flex-col relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/background/carbackground.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header Section */}
          <section className="relative">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg px-2">
                  Find Your Perfect Car
                </h1>
                <p className="text-sm sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto drop-shadow px-3">
                  Browse through thousands of verified vehicles from trusted dealers
                </p>
              </motion.div>
            </div>
          </section>

          {/* Favorites Navigation Button - Made smaller for mobile */}
          <div className="container mx-auto px-3 mb-3">
            <div className="flex justify-end">
              <button
                onClick={() => router.push('/favorites')}
                className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm"
              >
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <span className="hidden xs:inline">Favorites</span>
                <span className="xs:hidden">({favorites.length})</span>
                <span className="hidden xs:inline">({favorites.length})</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <section className="sticky top-0 z-40">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 bg-black/30 backdrop-blur-md">
              <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 w-full lg:max-w-2xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-3 h-3 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search by make, model, or dealer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-4 py-1.5 sm:py-3 text-xs sm:text-base border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto mt-2 sm:mt-0">
                  {/* Sort Dropdown - Smaller on mobile */}
                  <div className="relative flex-1 sm:flex-none min-w-[120px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-3 text-xs sm:text-base border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer pr-6 sm:pr-10"
                    >
                      <option value="featured" className="text-gray-900 bg-gray-100">Featured</option>
                      <option value="price-low" className="text-gray-900 bg-gray-100">Price: Low to High</option>
                      <option value="price-high" className="text-gray-900 bg-gray-100">Price: High to Low</option>
                      <option value="year-new" className="text-gray-900 bg-gray-100">Year: Newest</option>
                      <option value="mileage-low" className="text-gray-900 bg-gray-100">Mileage: Low</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 sm:pr-3 pointer-events-none">
                      <ChevronDown className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white/60" />
                    </div>
                  </div>

                  {/* Filter Toggle Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm shadow-lg shadow-orange-500/25 text-xs sm:text-base"
                  >
                    <Filter className="w-3 h-3 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="bg-white text-orange-600 text-xs font-bold px-1 sm:px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 sm:mt-6 p-3 sm:p-7 rounded-lg sm:rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                      {/* Filter Options from API */}
                      {[
                        { label: "Make", value: filters.make, options: filterOptions.makes, key: "make" },
                        { label: "Model", value: filters.model, options: filterOptions.models, key: "model" },
                        { label: "Transmission", value: filters.transmission, options: filterOptions.transmissions, key: "transmission" },
                        { label: "Fuel Type", value: filters.fuelType, options: filterOptions.fuelTypes, key: "fuelType" },
                        { label: "Location", value: filters.location, options: filterOptions.locations, key: "location" },
                      ].map(({ label, value, options, key }) => (
                        <div key={key} className="flex flex-col">
                          <label className="text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow-sm">
                            {label}
                          </label>
                          <div className="relative">
                            <select
                              value={value}
                              onChange={(e) => handleFilterChange(key, e.target.value)}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2.5 bg-white/10 border border-white/20 text-white text-xs sm:text-sm rounded-lg focus:ring-1 sm:focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-md appearance-none cursor-pointer transition-all duration-200 hover:bg-white/20 pr-6 sm:pr-8"
                            >
                              <option value="" className="text-gray-900 bg-gray-100">All</option>
                              {options.map((opt) => (
                                <option key={opt} value={opt} className="text-gray-900 bg-gray-100">
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 sm:pr-2 pointer-events-none">
                              <ChevronDown className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white/60" />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Year Range */}
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow-sm">
                          Year Range
                        </label>
                        <div className="flex gap-1 sm:gap-2">
                          <select
                            value={filters.minYear}
                            onChange={(e) => handleFilterChange("minYear", e.target.value)}
                            className="flex-1 px-1.5 sm:px-2 py-1.5 sm:py-2 bg-white/10 border border-white/20 text-white text-xs sm:text-sm rounded-lg focus:ring-1 sm:focus:ring-2 focus:ring-orange-400 hover:bg-white/20 transition-all duration-200 backdrop-blur-md appearance-none pr-5 sm:pr-6"
                          >
                            <option value="" className="text-gray-900 bg-gray-100">Min</option>
                            {filterOptions.years.map((year) => (
                              <option key={year} value={year} className="text-gray-900 bg-gray-100">
                                {year}
                              </option>
                            ))}
                          </select>
                          <select
                            value={filters.maxYear}
                            onChange={(e) => handleFilterChange("maxYear", e.target.value)}
                            className="flex-1 px-1.5 sm:px-2 py-1.5 sm:py-2 bg-white/10 border border-white/20 text-white text-xs sm:text-sm rounded-lg focus:ring-1 sm:focus:ring-2 focus:ring-orange-400 hover:bg-white/20 transition-all duration-200 backdrop-blur-md appearance-none pr-5 sm:pr-6"
                          >
                            <option value="" className="text-gray-900 bg-gray-100">Max</option>
                            {filterOptions.years.map((year) => (
                              <option key={year} value={year} className="text-gray-900 bg-gray-100">
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="col-span-1 xs:col-span-2 lg:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow">
                          Price Range ($)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Min"
                              value={filters.minPrice}
                              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Max"
                              value={filters.maxPrice}
                              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mileage Range */}
                      <div className="col-span-1 xs:col-span-2 lg:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow">
                          Mileage Range (km)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Min"
                              value={filters.minMileage}
                              onChange={(e) => handleFilterChange('minMileage', e.target.value)}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Max"
                              value={filters.maxMileage}
                              onChange={(e) => handleFilterChange('maxMileage', e.target.value)}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear Filters
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowFilters(false)}
                        className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all duration-200 shadow-md"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Apply Filters
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Results Section */}
          <section className="flex-1">
            <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-2xl border border-white/20 shadow-xl overflow-hidden"
              >
                {/* Results Header */}
                <div className="p-3 sm:p-6 border-b border-white/20">
                  <div className="flex justify-between items-center">
                    <p className="text-white/90 text-sm sm:text-lg font-medium drop-shadow">
                      Showing {filteredCars.length} of {cars.length} vehicles
                    </p>
                  </div>
                </div>

                {/* Cars Grid - UPDATED for 2 columns on mobile */}
                <div className="p-2 sm:p-6">
                  {filteredCars.length === 0 ? (
                    <div className="text-center py-6 sm:py-12">
                      <Car className="w-10 h-10 sm:w-16 sm:h-16 text-white/60 mx-auto mb-2 sm:mb-4" />
                      <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2 drop-shadow">
                        No cars found
                      </h3>
                      <p className="text-white/80 mb-3 sm:mb-4 drop-shadow text-xs sm:text-base">
                        Try adjusting your filters or search terms
                      </p>
                      <button
                        onClick={clearFilters}
                        className="px-3 sm:px-6 py-1.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm text-xs sm:text-base"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                      {filteredCars.map((car, index) => (
                        <motion.div
                          key={car.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-white/20 overflow-hidden group flex flex-col"
                        >
                          {/* Car Image - Smaller on mobile */}
                          <div className="relative h-32 sm:h-40 md:h-48 bg-gray-200 overflow-hidden cursor-pointer flex-shrink-0">
                            {car.images && car.images.length > 0 ? (
                              <>
                                <div 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                  onClick={() => {
                                    trackView(car.id);
                                    openImageGallery(car.images, 0);
                                  }}
                                >
                                  <img 
                                    src={car.images[0]} 
                                    alt={`${car.make} ${car.model}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {car.images.length > 1 && (
                                  <div 
                                    className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 cursor-pointer"
                                    onClick={() => {
                                      trackView(car.id);
                                      openImageGallery(car.images, 0);
                                    }}
                                  >
                                    <div className="flex">
                                      {car.images.slice(0, 2).map((_, idx) => (
                                        <div 
                                          key={idx}
                                          className={`w-1 h-1 rounded-full mx-0.5 ${
                                            idx === 0 ? 'bg-white' : 'bg-white/60'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-[10px] text-white bg-black/50 px-1 py-0.5 rounded">
                                      +{car.images.length - 1}
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div 
                                className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                  trackView(car.id);
                                  openImageGallery(car.images, 0);
                                }}
                              >
                                <Car className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-500" />
                              </div>
                            )}
                            
                            {/* Badges - Smaller on mobile */}
                            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                              {car.status === 'available' && (
                                <span className="bg-green-500 text-white text-[10px] sm:text-xs font-bold px-1 sm:px-2 py-0.5 rounded backdrop-blur-sm">
                                  Available
                                </span>
                              )}
                            </div>

                            {/* Action Buttons - Always visible on mobile, larger on hover */}
                            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                              {/* Favorite Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(car.id);
                                }}
                                className={`p-1 sm:p-1.5 rounded-full bg-white/90 backdrop-blur-sm ${
                                  favorites.includes(car.id) 
                                    ? 'text-red-500' 
                                    : 'text-gray-600 hover:text-red-500'
                                } transition-colors duration-200`}
                              >
                                <Heart 
                                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" 
                                  fill={favorites.includes(car.id) ? 'currentColor' : 'none'}
                                />
                              </button>
                              
                              {/* Share Button */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  trackView(car.id);
                                  shareCarToWhatsApp(car);
                                }}
                                className="p-1 sm:p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-green-500 transition-colors duration-200"
                                title="Share car with image and link"
                              >
                                <Share2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Car Details - Compact layout for mobile */}
                          <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
                            {/* Title and Price - More compact */}
                            <div className="flex justify-between items-start mb-1 sm:mb-2">
                              <div className="flex-1 min-w-0 pr-1">
                                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base truncate leading-tight">
                                  {car.make} {car.model}
                                </h3>
                                <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm truncate">
                                  {car.year}
                                </p>
                              </div>
                              <div className="text-right ml-1">
                                <p className="font-bold text-orange-600 text-xs sm:text-sm md:text-base whitespace-nowrap">
                                  ${car.price.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Specifications - 2x2 grid, smaller icons */}
                            <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3 text-[10px] sm:text-xs md:text-sm text-gray-600">
                              <div className="flex items-center gap-0.5 sm:gap-1 truncate">
                                <Gauge className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="truncate">{(car.mileage/1000).toFixed(0)}k km</span>
                              </div>
                              <div className="flex items-center gap-0.5 sm:gap-1 truncate">
                                <Settings className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="truncate">{car.transmission}</span>
                              </div>
                              <div className="flex items-center gap-0.5 sm:gap-1 truncate">
                                <Fuel className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="truncate">{car.fuelType}</span>
                              </div>
                              <div className="flex items-center gap-0.5 sm:gap-1">
                                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
                                <span>{car.year}</span>
                              </div>
                            </div>

                            {/* Location - Smaller */}
                            <div className="flex items-center text-[10px] sm:text-xs md:text-sm mb-1 sm:mb-2 mt-auto">
                              <div className="flex items-center gap-0.5 sm:gap-1 text-gray-600 flex-1 min-w-0">
                                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="truncate">{car.location}</span>
                              </div>
                            </div>

                            {/* Dealer Info - More compact */}
                            <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-gray-200">
                              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                <div className="flex items-center gap-1 sm:gap-2 truncate">
                                  <Building className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-orange-500 flex-shrink-0" />
                                  <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 truncate">
                                    {car.dealer.companyName}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Contact Information - Smaller */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                  <Phone className="w-2.5 h-2.5 text-green-600" />
                                  <span className="text-[10px] sm:text-xs text-gray-600 font-medium truncate">
                                    {formatPhoneNumber(car.dealer.phone)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Button - Full width, smaller on mobile */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                trackInquiry(car.id);
                                contactDealerWhatsApp(car);
                              }}
                              className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 sm:py-2 px-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-3"
                              title="Contact dealer with car details, image, and link"
                            >
                              <MessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                              <span className="truncate">WhatsApp</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={selectedCarImages}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
}