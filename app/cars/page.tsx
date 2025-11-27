/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

export default function BrowseCars() {
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
        
        // Fetch car listings
        const listingsResponse = await fetch('/api/car-listings');
        if (!listingsResponse.ok) throw new Error('Failed to fetch listings');
        const listingsData = await listingsResponse.json();
        
        // Fetch filter options
        const filtersResponse = await fetch('/api/car-filters');
        if (!filtersResponse.ok) throw new Error('Failed to fetch filters');
        const filtersData = await filtersResponse.json();
        
        setCars(listingsData.listings);
        setFilteredCars(listingsData.listings);
        setFilterOptions(filtersData.filterOptions);

        // Fetch user favorites if logged in
        if (session) {
          const favoritesResponse = await fetch('/api/favorites');
          if (favoritesResponse.ok) {
            const favoritesData = await favoritesResponse.json();
            setFavorites(favoritesData.favorites.map((fav: CarListing) => fav.id));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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

  // Toggle favorite
  const toggleFavorite = async (carId: string) => {
    if (!session) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    const isCurrentlyFavorite = favorites.includes(carId);
    const action = isCurrentlyFavorite ? 'remove' : 'add';

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: carId,
          action: action,
        }),
      });

      if (response.ok) {
        if (isCurrentlyFavorite) {
          setFavorites(prev => prev.filter(id => id !== carId));
        } else {
          setFavorites(prev => [...prev, carId]);
        }
      } else {
        console.error('Failed to update favorite');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  // Share car via WhatsApp
  const shareCar = (car: CarListing) => {
    const message = `Check out this ${car.make} ${car.model} (${car.year}) for $${car.price.toLocaleString()}!\n\nLocation: ${car.location}\nMileage: ${car.mileage.toLocaleString()} km\nTransmission: ${car.transmission}\nFuel Type: ${car.fuelType}\n\nDealer: ${car.dealer.companyName}`;
    
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
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

  const createWhatsAppLink = (phone: string, car: CarListing) => {
    if (!phone || phone === 'Not provided') return '#';
    
    const cleanedPhone = phone.replace(/\D/g, '');
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
    
    const message = `Hi, I'm interested in your ${car.make} ${car.model} (${car.year}) listed for $${car.price.toLocaleString()}. Could you provide more details?`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== '').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading premium vehicles...</div>
      </div>
    );
  }

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
            <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg px-2">
                  Find Your Perfect Car
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto drop-shadow px-3">
                  Browse through thousands of verified vehicles from trusted dealers across Africa
                </p>
              </motion.div>
            </div>
          </section>

          {/* Favorites Navigation Button */}
          <div className="container mx-auto px-4 mb-4">
            <div className="flex justify-end">
              <button
                onClick={() => router.push('/favorites')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
              >
                <Heart className="w-4 h-4 fill-current" />
                My Favorites ({favorites.length})
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <section className="sticky top-0 z-40">
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 bg-black/30 backdrop-blur-md">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 w-full lg:max-w-2xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search by make, model, or dealer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
                  {/* Sort Dropdown */}
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer pr-8 sm:pr-10"
                    >
                      <option value="featured" className="text-gray-900">Featured</option>
                      <option value="price-low" className="text-gray-900">Price: Low to High</option>
                      <option value="price-high" className="text-gray-900">Price: High to Low</option>
                      <option value="year-new" className="text-gray-900">Year: Newest First</option>
                      <option value="mileage-low" className="text-gray-900">Mileage: Low to High</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                    </div>
                  </div>

                  {/* Filter Toggle Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm shadow-lg shadow-orange-500/25 text-sm sm:text-base"
                  >
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="bg-white text-orange-600 text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
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
                    className="mt-4 sm:mt-6 p-5 sm:p-7 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                      {/* Filter Options from API */}
                      {[
                        { label: "Make", value: filters.make, options: filterOptions.makes, key: "make" },
                        { label: "Model", value: filters.model, options: filterOptions.models, key: "model" },
                        { label: "Transmission", value: filters.transmission, options: filterOptions.transmissions, key: "transmission" },
                        { label: "Fuel Type", value: filters.fuelType, options: filterOptions.fuelTypes, key: "fuelType" },
                        { label: "Location", value: filters.location, options: filterOptions.locations, key: "location" },
                      ].map(({ label, value, options, key }) => (
                        <div key={key} className="flex flex-col">
                          <label className="text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                            {label}
                          </label>
                          <div className="relative">
                            <select
                              value={value}
                              onChange={(e) => handleFilterChange(key, e.target.value)}
                              className="w-full px-3 py-2.5 bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-md appearance-none cursor-pointer transition-all duration-200 hover:bg-white/20 pr-8"
                            >
                              <option value="" className="text-gray-900">All</option>
                              {options.map((opt) => (
                                <option key={opt} value={opt} className="text-gray-900">
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <ChevronDown className="w-4 h-4 text-white/60" />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Year Range */}
                      <div>
                        <label className="text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                          Year Range
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={filters.minYear}
                            onChange={(e) => handleFilterChange("minYear", e.target.value)}
                            className="flex-1 px-2 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-orange-400 hover:bg-white/20 transition-all duration-200 backdrop-blur-md appearance-none pr-6"
                          >
                            <option value="" className="text-gray-900">Min</option>
                            {filterOptions.years.map((year) => (
                              <option key={year} value={year} className="text-gray-900">
                                {year}
                              </option>
                            ))}
                          </select>
                          <select
                            value={filters.maxYear}
                            onChange={(e) => handleFilterChange("maxYear", e.target.value)}
                            className="flex-1 px-2 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-orange-400 hover:bg-white/20 transition-all duration-200 backdrop-blur-md appearance-none pr-6"
                          >
                            <option value="" className="text-gray-900">Max</option>
                            {filterOptions.years.map((year) => (
                              <option key={year} value={year} className="text-gray-900">
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="col-span-1 xs:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow">
                          Price Range ($)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Min"
                              value={filters.minPrice}
                              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Max"
                              value={filters.maxPrice}
                              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mileage Range */}
                      <div className="col-span-1 xs:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow">
                          Mileage Range (km)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Min"
                              value={filters.minMileage}
                              onChange={(e) => handleFilterChange('minMileage', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              placeholder="Max"
                              value={filters.maxMileage}
                              onChange={(e) => handleFilterChange('maxMileage', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 text-sm font-medium transition-all duration-200 shadow-sm"
                      >
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear Filters
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowFilters(false)}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 shadow-xl overflow-hidden"
              >
                {/* Results Header */}
                <div className="p-4 sm:p-6 border-b border-white/20">
                  <div className="flex justify-between items-center">
                    <p className="text-white/90 text-base sm:text-lg font-medium drop-shadow">
                      Showing {filteredCars.length} of {cars.length} vehicles
                    </p>
                  </div>
                </div>

                {/* Cars Grid */}
                <div className="p-4 sm:p-6">
                  {filteredCars.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Car className="w-12 h-12 sm:w-16 sm:h-16 text-white/60 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 drop-shadow">
                        No cars found
                      </h3>
                      <p className="text-white/80 mb-4 drop-shadow text-sm sm:text-base">
                        Try adjusting your filters or search terms
                      </p>
                      <button
                        onClick={clearFilters}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm text-sm sm:text-base"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {filteredCars.map((car, index) => (
                        <motion.div
                          key={car.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 overflow-hidden group"
                        >
                          {/* Car Image */}
                          <div className="relative h-36 sm:h-48 bg-gray-200 overflow-hidden">
                            {car.images && car.images.length > 0 ? (
                              <img 
                                src={car.images[0]} 
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                                <Car className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
                              </div>
                            )}
                            
                            {/* Badges */}
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                              {car.status === 'available' && (
                                <span className="bg-green-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded backdrop-blur-sm">
                                  Available
                                </span>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {/* Favorite Button */}
                              <button
                                onClick={() => toggleFavorite(car.id)}
                                className={`p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm ${
                                  favorites.includes(car.id) 
                                    ? 'text-red-500' 
                                    : 'text-gray-600 hover:text-red-500'
                                } transition-colors duration-200`}
                              >
                                <Heart 
                                  className="w-3 h-3 sm:w-4 sm:h-4" 
                                  fill={favorites.includes(car.id) ? 'currentColor' : 'none'}
                                />
                              </button>
                              
                              {/* Share Button */}
                              <button 
                                onClick={() => shareCar(car)}
                                className="p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-green-500 transition-colors duration-200"
                              >
                                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Car Details */}
                          <div className="p-3 sm:p-4">
                            {/* Title and Price */}
                            <div className="flex justify-between items-start mb-2 sm:mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                  {car.make} {car.model}
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                  {car.year}
                                </p>
                              </div>
                              <div className="text-right ml-2">
                                <p className="font-bold text-orange-600 text-sm sm:text-base whitespace-nowrap">
                                  ${car.price.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Specifications */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Gauge className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate">{car.mileage.toLocaleString()} km</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate">{car.transmission}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Fuel className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate">{car.fuelType}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{car.year}</span>
                              </div>
                            </div>

                            {/* Location - Removed Views */}
                            <div className="flex items-center text-xs sm:text-sm mb-2">
                              <div className="flex items-center gap-1 text-gray-600 flex-1 min-w-0">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{car.location}</span>
                              </div>
                            </div>

                            {/* Dealer Info */}
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Building className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                                  <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                    {car.dealer.companyName}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Contact Information */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-green-600" />
                                  <span className="text-xs text-gray-600 font-medium">
                                    {formatPhoneNumber(car.dealer.phone)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-3 sm:mt-4">
                              <a
                                href={createWhatsAppLink(car.dealer.phone, car)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 sm:py-2 px-3 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                WhatsApp
                              </a>
                            </div>
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
    </div>
  );
}