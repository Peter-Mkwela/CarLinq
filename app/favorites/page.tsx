/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Car, 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Building, 
  Sparkles,
  MapPin,
  Gauge,
  Cog,
  Fuel,
  Badge,
  Calendar,
  DollarSign,
  Trash2,
  Eye,
  Shield,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  views: number;
  inquiries: number;
}

// Add this session helper function
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('car_session_id');
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('car_session_id', sessionId);
  }
  
  return sessionId;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/favorites?sessionId=${sessionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
        
        // Also update localStorage for consistency
        const favoriteIds = data.favorites.map((car: CarListing) => car.id);
        localStorage.setItem('clientFavorites', JSON.stringify(favoriteIds));
      } else {
        // Fallback to localStorage if API fails
        const storedFavorites = localStorage.getItem('clientFavorites');
        if (storedFavorites) {
          const favoriteIds = JSON.parse(storedFavorites);
          
          // We need to fetch car details for each ID
          const carsResponse = await fetch('/api/car-listings');
          if (carsResponse.ok) {
            const allCars = await carsResponse.json();
            const favoriteCars = allCars.listings.filter((car: CarListing) => 
              favoriteIds.includes(car.id)
            );
            setFavorites(favoriteCars);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
      
      // Ultimate fallback: empty array
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (carId: string) => {
    setRemovingId(carId);
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/favorites/${carId}?sessionId=${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from state
        setFavorites(prev => prev.filter(car => car.id !== carId));
        
        // Update localStorage
        const storedFavorites = localStorage.getItem('clientFavorites');
        if (storedFavorites) {
          const currentFavorites = JSON.parse(storedFavorites);
          const updatedFavorites = currentFavorites.filter((id: string) => id !== carId);
          localStorage.setItem('clientFavorites', JSON.stringify(updatedFavorites));
        }
        
        toast.success('Removed from favorites');
      } else {
        throw new Error('Failed to remove favorite');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    } finally {
      setRemovingId(null);
    }
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
    }
    const message = `Hi, I'm interested in your ${car.make} ${car.model} (${car.year}) listed for $${car.price.toLocaleString()}. Could you provide more details?`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen relative">
        {/* Background Image with Overlay */}
        <div 
            className="fixed inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/background/carbackground.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10">
            <div className="container mx-auto px-4 py-8">
                {/* Premium Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8"
                >
                    <button
                        onClick={() => router.back()}
                        className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-6 h-6 text-white/80 group-hover:text-white transition-colors duration-300" />
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/25 backdrop-blur-sm">
                                <Heart className="w-7 h-7 text-white fill-current" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{favorites.length}</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                                My Favorite Cars
                            </h1>
                            <p className="text-orange-200/80 text-sm flex items-center gap-2 mt-1">
                                <Sparkles className="w-4 h-4" />
                                Your curated collection of premium vehicles
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Favorites Grid */}
                {favorites.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 relative z-10"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-sm">
                            <Heart className="w-12 h-12 text-white/40" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-3">No favorites yet</h2>
                        <p className="text-white/70 mb-8 max-w-md mx-auto">
                            Start exploring our premium vehicle collection and add your favorite cars to this list for quick access.
                        </p>
                        <button
                            onClick={() => router.push('/cars')}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-orange-500/25 flex items-center justify-center gap-3 mx-auto backdrop-blur-sm"
                        >
                            <Car className="w-5 h-5" />
                            Browse Premium Vehicles
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10"
                    >
                        {favorites.map((car, index) => (
                            <motion.div
                                key={car.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl group"
                            >
                                {/* Car Image with Overlay */}
                                <div className="relative h-48 bg-gradient-to-br from-orange-500/10 to-amber-600/10 overflow-hidden">
                                    {car.images && car.images.length > 0 ? (
                                        <>
                                            <img 
                                                src={car.images[0]} 
                                                alt={`${car.make} ${car.model}`}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-amber-600/20 flex items-center justify-center">
                                            <Car className="w-16 h-16 text-orange-300" />
                                        </div>
                                    )}
                                    
                                    {/* Status Badge - FIXED (Green with white text) */}
<div className="absolute top-4 left-4">
  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
    car.status === 'AVAILABLE' 
      ? 'bg-green-600 text-white border border-green-700 shadow-lg shadow-green-600/20' 
      : 'bg-green-600 text-white border border-orange-700 shadow-lg shadow-green-600/20'
  }`}>
    {car.status}
  </span>
</div>

                                    {/* Remove Button - FIXED (Red) */}
<button
  onClick={() => removeFromFavorites(car.id)}
  disabled={removingId === car.id}
  className="absolute top-4 right-4 w-10 h-10 bg-red-500/80 hover:bg-red-600 border border-red-500 hover:border-red-600 rounded-xl flex items-center justify-center transition-all duration-300 group/remove backdrop-blur-sm shadow-lg shadow-red-500/20"
>
  {removingId === car.id ? (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    <Trash2 className="w-5 h-5 text-white" />
  )}
</button>

                                    {/* Views & Inquiries */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white/80 text-sm">
                                        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                                            <Eye className="w-4 h-4" />
                                            <span>{car.views}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{car.inquiries}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Car Details */}
                                <div className="p-6">
                                    {/* Title and Price */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-white text-xl mb-1">
                                                {car.make} {car.model}
                                            </h3>
                                            <div className="flex items-center gap-2 text-orange-300">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm font-medium">{car.year}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-2xl bg-gradient-to-r from-orange-300 to-amber-400 bg-clip-text text-transparent">
                                                ${car.price.toLocaleString()}
                                            </p>
                                            <p className="text-white/70 text-sm">Asking Price</p>
                                        </div>
                                    </div>

                                    {/* Specifications Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center gap-2 text-white/80">
                                            <MapPin className="w-4 h-4 text-orange-300" />
                                            <span className="text-sm truncate">{car.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Gauge className="w-4 h-4 text-orange-300" />
                                            <span className="text-sm">{car.mileage.toLocaleString()} km</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Cog className="w-4 h-4 text-orange-300" />
                                            <span className="text-sm">{car.transmission}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Fuel className="w-4 h-4 text-orange-300" />
                                            <span className="text-sm">{car.fuelType}</span>
                                        </div>
                                    </div>

                                    {/* Dealer Info */}
                                    <div className="border-t border-white/20 pt-4 mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-orange-500/30 border border-orange-500/50 flex items-center justify-center backdrop-blur-sm">
                                                <Building className="w-4 h-4 text-orange-300" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-sm">{car.dealer.companyName}</p>
                                                <div className="flex items-center gap-2 text-white/70 text-xs">
                                                    <Phone className="w-3 h-3 text-green-300" />
                                                    <span>{formatPhoneNumber(car.dealer.phone)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <a
                                        href={createWhatsAppLink(car.dealer.phone, car)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center justify-center gap-3 font-semibold group/action backdrop-blur-sm"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Contact Dealer
                                        <CheckCircle className="w-5 h-5 opacity-0 group-hover/action:opacity-100 transition-opacity duration-300" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    </div>
  );
}